package dk.wordblitz.domain.port.in;

import dk.wordblitz.domain.model.SnakeLeaderboardEntry;

import java.util.List;

public interface SnakeUseCase {

    record SubmitScoreCommand(Long userId, int score) {}

    void submitScore(SubmitScoreCommand command);

    List<SnakeLeaderboardEntry> getLeaderboard(int limit);
}
