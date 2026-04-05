package dk.wordblitz.domain.model;

public record TetrisLeaderboardEntry(int rank, String username, int score, int level, int lines) {}
