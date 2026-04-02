package dk.wordblitz.infrastructure.adapter.out.persistence;

import dk.wordblitz.domain.model.GameAnswer;
import dk.wordblitz.domain.port.out.GameAnswerRepository;
import dk.wordblitz.infrastructure.adapter.out.persistence.entity.GameAnswerEntity;
import dk.wordblitz.infrastructure.adapter.out.persistence.repository.GameAnswerJpaRepository;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class GameAnswerPersistenceAdapter implements GameAnswerRepository {

    private final GameAnswerJpaRepository jpa;

    public GameAnswerPersistenceAdapter(GameAnswerJpaRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public GameAnswer save(GameAnswer answer) {
        GameAnswerEntity entity = new GameAnswerEntity(
                answer.id(), answer.sessionId(), answer.wordId(), answer.chosenCategoryId(),
                answer.correct(), answer.timeRemaining(), answer.pointsEarned(),
                answer.streakAtAnswer(), answer.answeredAt()
        );
        return toDomain(jpa.save(entity));
    }

    @Override
    public List<GameAnswer> findBySessionId(Long sessionId) {
        return jpa.findBySessionIdOrderByAnsweredAtAsc(sessionId).stream().map(this::toDomain).toList();
    }

    @Override
    public int countCorrectBySessionId(Long sessionId) {
        return jpa.countCorrectBySessionId(sessionId);
    }

    @Override
    public int getCurrentStreakForSession(Long sessionId) {
        return jpa.getCurrentStreakForSession(sessionId);
    }

    private GameAnswer toDomain(GameAnswerEntity e) {
        return new GameAnswer(e.getId(), e.getSessionId(), e.getWordId(), e.getChosenCategoryId(),
                e.isCorrect(), e.getTimeRemaining(), e.getPointsEarned(),
                e.getStreakAtAnswer(), e.getAnsweredAt());
    }
}
