package dk.wordblitz.domain.port.in;

public interface MathUseCase {

    record SubmitScoreCommand(Long userId, int score, String difficulty) {}

    void submitScore(SubmitScoreCommand command);
}
