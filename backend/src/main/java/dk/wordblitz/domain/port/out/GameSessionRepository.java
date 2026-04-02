package dk.wordblitz.domain.port.out;

import dk.wordblitz.domain.model.GameSession;
import dk.wordblitz.domain.model.LeaderboardEntry;

import java.util.List;
import java.util.Optional;

public interface GameSessionRepository {
    GameSession save(GameSession session);
    Optional<GameSession> findById(Long id);
    List<LeaderboardEntry> findTopScores(int limit);
    List<GameSession> findAllPaged(int page, int size);
}
