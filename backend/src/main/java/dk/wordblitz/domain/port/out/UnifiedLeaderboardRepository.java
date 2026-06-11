package dk.wordblitz.domain.port.out;

import dk.wordblitz.domain.model.PlayerProgress;
import dk.wordblitz.domain.model.UnifiedLeaderboardEntry;

import java.util.List;

public interface UnifiedLeaderboardRepository {
    /** Best score per player for the given game type, ranked descending. */
    List<UnifiedLeaderboardEntry> findTop(String gameType, int limit);

    /** Plays and best score per player per game type. */
    List<PlayerProgress> findProgress();
}
