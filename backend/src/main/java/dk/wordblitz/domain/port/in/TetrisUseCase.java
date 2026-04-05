package dk.wordblitz.domain.port.in;

import dk.wordblitz.domain.model.TetrisLeaderboardEntry;

import java.util.List;

public interface TetrisUseCase {

    record SubmitScoreCommand(Long userId, int score, int level, int lines) {}

    void submitScore(SubmitScoreCommand command);

    List<TetrisLeaderboardEntry> getLeaderboard(int limit);
}
