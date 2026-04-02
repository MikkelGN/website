package dk.wordblitz.domain.port.in;

import dk.wordblitz.domain.model.GameSession;
import dk.wordblitz.domain.model.Word;

import java.util.List;

public interface GameUseCase {

    record StartSessionCommand(Long userId, List<Long> categoryIds) {}

    record AnswerCommand(Long sessionId, Long wordId, Long chosenCategoryId, double timeRemaining) {}

    record AnswerResult(
            boolean correct,
            int pointsEarned,
            int totalScore,
            int streak,
            double nextTimeLimit,
            boolean gameOver
    ) {}

    record NextWordResult(Long wordId, String wordText, List<Long> categoryIds) {}

    GameSession startSession(StartSessionCommand command);

    NextWordResult getNextWord(Long sessionId);

    AnswerResult submitAnswer(AnswerCommand command);

    GameSession completeSession(Long sessionId);
}
