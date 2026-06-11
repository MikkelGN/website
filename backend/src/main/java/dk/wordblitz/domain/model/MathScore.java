package dk.wordblitz.domain.model;

import java.time.Instant;

public record MathScore(Long id, Long userId, int score, String difficulty, Instant playedAt) {}
