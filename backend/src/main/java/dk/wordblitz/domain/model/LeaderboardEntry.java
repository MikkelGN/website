package dk.wordblitz.domain.model;

public record LeaderboardEntry(
        int rank,
        String username,
        int totalScore,
        int correctAnswers,
        int maxStreak
) {}
