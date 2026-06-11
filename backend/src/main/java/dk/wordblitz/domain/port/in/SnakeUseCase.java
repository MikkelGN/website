package dk.wordblitz.domain.port.in;

public interface SnakeUseCase {

    record SubmitScoreCommand(Long userId, int score) {}

    void submitScore(SubmitScoreCommand command);
}
