package dk.wordblitz.application.service;

import dk.wordblitz.domain.model.LeaderboardEntry;
import dk.wordblitz.domain.port.in.LeaderboardUseCase;
import dk.wordblitz.domain.port.out.GameSessionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class LeaderboardService implements LeaderboardUseCase {

    private final GameSessionRepository sessionRepository;

    public LeaderboardService(GameSessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    @Override
    public List<LeaderboardEntry> getTopScores(int limit) {
        return sessionRepository.findTopScores(Math.min(limit, 100));
    }
}
