package dk.wordblitz.domain.model;

import java.time.Instant;
import java.util.List;

public record GameSession(
        Long id,
        Long userId,
        List<Long> categoryIds,
        Instant startedAt,
        Instant completedAt,
        int totalScore,
        int correctAnswers,
        int maxStreak
) {
    public boolean isCompleted() {
        return completedAt != null;
    }
}
