package dk.wordblitz.application.service;

import dk.wordblitz.domain.model.PlayerProgress;
import dk.wordblitz.domain.model.UnifiedLeaderboardEntry;
import dk.wordblitz.domain.port.in.LeaderboardUseCase;
import dk.wordblitz.domain.port.out.UnifiedLeaderboardRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@Transactional(readOnly = true)
public class LeaderboardService implements LeaderboardUseCase {

    public static final Set<String> GAME_TYPES = Set.of("word-blitz", "math-blitz", "snake", "tetris");

    private final UnifiedLeaderboardRepository repository;

    public LeaderboardService(UnifiedLeaderboardRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<UnifiedLeaderboardEntry> getLeaderboard(String gameType, int limit) {
        if (!GAME_TYPES.contains(gameType)) {
            throw new IllegalArgumentException("Unknown game type: " + gameType);
        }
        return repository.findTop(gameType, Math.min(limit, 100));
    }

    @Override
    public List<PlayerProgress> getProgress() {
        return repository.findProgress();
    }
}
