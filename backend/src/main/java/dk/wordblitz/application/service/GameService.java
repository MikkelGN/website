package dk.wordblitz.application.service;

import dk.wordblitz.domain.model.GameAnswer;
import dk.wordblitz.domain.model.GameSession;
import dk.wordblitz.domain.model.Word;
import dk.wordblitz.domain.port.in.GameUseCase;
import dk.wordblitz.domain.port.out.GameAnswerRepository;
import dk.wordblitz.domain.port.out.GameSessionRepository;
import dk.wordblitz.domain.port.out.WordRepository;
import dk.wordblitz.domain.service.ScoreCalculator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Random;

@Service
@Transactional
public class GameService implements GameUseCase {

    private final GameSessionRepository sessionRepository;
    private final GameAnswerRepository answerRepository;
    private final WordRepository wordRepository;
    private final ScoreCalculator scoreCalculator;
    private final Random random = new Random();

    public GameService(GameSessionRepository sessionRepository,
                       GameAnswerRepository answerRepository,
                       WordRepository wordRepository,
                       ScoreCalculator scoreCalculator) {
        this.sessionRepository = sessionRepository;
        this.answerRepository = answerRepository;
        this.wordRepository = wordRepository;
        this.scoreCalculator = scoreCalculator;
    }

    @Override
    public GameSession startSession(StartSessionCommand command) {
        if (command.categoryIds().size() < 2) {
            throw new IllegalArgumentException("At least 2 categories must be selected");
        }
        GameSession session = new GameSession(
                null, command.userId(), command.categoryIds(),
                Instant.now(), null, 0, 0, 0
        );
        return sessionRepository.save(session);
    }

    @Override
    @Transactional(readOnly = true)
    public NextWordResult getNextWord(Long sessionId) {
        GameSession session = requireSession(sessionId);
        List<Word> words = wordRepository.findByCategoryIds(session.categoryIds());
        if (words.isEmpty()) {
            throw new NoSuchElementException("No words found for selected categories");
        }
        Word word = words.get(random.nextInt(words.size()));
        return new NextWordResult(word.id(), word.text(), session.categoryIds());
    }

    @Override
    public AnswerResult submitAnswer(AnswerCommand command) {
        GameSession session = requireSession(command.sessionId());
        Word word = wordRepository.findById(command.wordId())
                .orElseThrow(() -> new NoSuchElementException("Word not found: " + command.wordId()));

        boolean correct = word.categoryId().equals(command.chosenCategoryId());
        int streak = answerRepository.getCurrentStreakForSession(command.sessionId());

        // Calculate current time limit based on number of correct answers so far
        int correctSoFar = answerRepository.countCorrectBySessionId(command.sessionId());
        double currentTimeLimit = scoreCalculator.startingTimeLimit();
        for (int i = 0; i < correctSoFar; i++) {
            currentTimeLimit = scoreCalculator.nextTimeLimit(currentTimeLimit);
        }

        int pointsEarned = 0;
        int newStreak = streak;
        double nextTimeLimit = currentTimeLimit;

        if (correct) {
            pointsEarned = scoreCalculator.calculatePoints(command.timeRemaining(), currentTimeLimit, streak);
            newStreak = streak + 1;
            nextTimeLimit = scoreCalculator.nextTimeLimit(currentTimeLimit);
        } else {
            newStreak = 0;
        }

        GameAnswer answer = new GameAnswer(
                null, command.sessionId(), command.wordId(), command.chosenCategoryId(),
                correct, command.timeRemaining(), pointsEarned, streak, Instant.now()
        );
        answerRepository.save(answer);

        // Update session totals
        int newTotal = session.totalScore() + pointsEarned;
        int newCorrect = session.correctAnswers() + (correct ? 1 : 0);
        int newMaxStreak = Math.max(session.maxStreak(), newStreak);
        GameSession updated = new GameSession(
                session.id(), session.userId(), session.categoryIds(),
                session.startedAt(), null, newTotal, newCorrect, newMaxStreak
        );
        sessionRepository.save(updated);

        return new AnswerResult(correct, pointsEarned, newTotal, newStreak, nextTimeLimit, !correct);
    }

    @Override
    public GameSession completeSession(Long sessionId) {
        GameSession session = requireSession(sessionId);
        GameSession completed = new GameSession(
                session.id(), session.userId(), session.categoryIds(),
                session.startedAt(), Instant.now(),
                session.totalScore(), session.correctAnswers(), session.maxStreak()
        );
        return sessionRepository.save(completed);
    }

    private GameSession requireSession(Long sessionId) {
        return sessionRepository.findById(sessionId)
                .orElseThrow(() -> new NoSuchElementException("Session not found: " + sessionId));
    }
}
