package dk.wordblitz.domain.port.in;

public interface TetrisUseCase {

    record SubmitScoreCommand(Long userId, int score, int level, int lines) {}

    void submitScore(SubmitScoreCommand command);
}
