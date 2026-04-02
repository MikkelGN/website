package dk.wordblitz.domain.port.in;

import dk.wordblitz.domain.model.LeaderboardEntry;

import java.util.List;

public interface LeaderboardUseCase {
    List<LeaderboardEntry> getTopScores(int limit);
}
