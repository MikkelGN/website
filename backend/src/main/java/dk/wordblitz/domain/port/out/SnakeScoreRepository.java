package dk.wordblitz.domain.port.out;

import dk.wordblitz.domain.model.SnakeLeaderboardEntry;
import dk.wordblitz.domain.model.SnakeScore;

import java.util.List;

public interface SnakeScoreRepository {
    SnakeScore save(SnakeScore score);
    List<SnakeLeaderboardEntry> findTopScores(int limit);
}
