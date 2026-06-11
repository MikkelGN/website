package dk.wordblitz.domain.port.out;

import dk.wordblitz.domain.model.GameSession;

import java.util.List;
import java.util.Optional;

public interface GameSessionRepository {
    GameSession save(GameSession session);
    Optional<GameSession> findById(Long id);
    List<GameSession> findAllPaged(int page, int size);
}
