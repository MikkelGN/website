package dk.wordblitz.domain.model;

import java.time.Instant;

public record AppUser(
        Long id,
        String username,
        Instant createdAt
) {}
