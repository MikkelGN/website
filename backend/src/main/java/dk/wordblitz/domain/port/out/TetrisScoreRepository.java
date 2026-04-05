package dk.wordblitz.domain.port.out;

import dk.wordblitz.domain.model.TetrisLeaderboardEntry;
import dk.wordblitz.domain.model.TetrisScore;

import java.util.List;

public interface TetrisScoreRepository {
    TetrisScore save(TetrisScore score);
    List<TetrisLeaderboardEntry> findTopScores(int limit);
}
