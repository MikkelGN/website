package dk.wordblitz.domain.model;

import java.time.Instant;

public record Player(
        Long id,
        String displayName,
        String avatarKey,
        String pinHash,
        Instant createdAt
) {}
