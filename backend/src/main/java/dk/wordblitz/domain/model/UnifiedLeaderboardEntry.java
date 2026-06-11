package dk.wordblitz.domain.model;

import java.util.Map;

public record UnifiedLeaderboardEntry(
        int rank,
        String displayName,
        int score,
        Map<String, Object> metadata
) {}
