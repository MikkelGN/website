package dk.wordblitz.domain.model;

import java.time.Instant;

public record SnakeScore(Long id, Long userId, int score, Instant playedAt) {}
