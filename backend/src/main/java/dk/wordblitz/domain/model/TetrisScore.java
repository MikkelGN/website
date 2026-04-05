package dk.wordblitz.domain.model;

import java.time.Instant;

public record TetrisScore(Long id, Long userId, int score, int level, int lines, Instant playedAt) {}
