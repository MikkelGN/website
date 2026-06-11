package dk.wordblitz.domain.port.in;

import dk.wordblitz.domain.model.PlayerProgress;
import dk.wordblitz.domain.model.UnifiedLeaderboardEntry;

import java.util.List;

public interface LeaderboardUseCase {
    List<UnifiedLeaderboardEntry> getLeaderboard(String gameType, int limit);
    List<PlayerProgress> getProgress();
}
