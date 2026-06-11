package dk.wordblitz.domain.model;

public record PlayerProgress(
        String displayName,
        String gameType,
        long plays,
        int bestScore
) {}
