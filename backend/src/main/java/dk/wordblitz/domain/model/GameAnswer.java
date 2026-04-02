package dk.wordblitz.domain.model;

import java.time.Instant;

public record GameAnswer(
        Long id,
        Long sessionId,
        Long wordId,
        Long chosenCategoryId,
        boolean correct,
        double timeRemaining,
        int pointsEarned,
        int streakAtAnswer,
        Instant answeredAt
) {}
