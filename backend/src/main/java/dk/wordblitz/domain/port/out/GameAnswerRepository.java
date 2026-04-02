package dk.wordblitz.domain.port.out;

import dk.wordblitz.domain.model.GameAnswer;

import java.util.List;

public interface GameAnswerRepository {
    GameAnswer save(GameAnswer answer);
    List<GameAnswer> findBySessionId(Long sessionId);
    int countCorrectBySessionId(Long sessionId);
    int getCurrentStreakForSession(Long sessionId);
}
