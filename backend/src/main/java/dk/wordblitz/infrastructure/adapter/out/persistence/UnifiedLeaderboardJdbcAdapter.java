package dk.wordblitz.infrastructure.adapter.out.persistence;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import dk.wordblitz.domain.model.PlayerProgress;
import dk.wordblitz.domain.model.UnifiedLeaderboardEntry;
import dk.wordblitz.domain.port.out.UnifiedLeaderboardRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class UnifiedLeaderboardJdbcAdapter implements UnifiedLeaderboardRepository {

    private final JdbcTemplate jdbc;
    private final ObjectMapper objectMapper;

    public UnifiedLeaderboardJdbcAdapter(JdbcTemplate jdbc, ObjectMapper objectMapper) {
        this.jdbc = jdbc;
        this.objectMapper = objectMapper;
    }

    @Override
    public List<UnifiedLeaderboardEntry> findTop(String gameType, int limit) {
        AtomicInteger rank = new AtomicInteger(1);
        return jdbc.query("""
                SELECT display_name, score, metadata FROM (
                    SELECT p.display_name, le.score, le.metadata::text AS metadata,
                           ROW_NUMBER() OVER (PARTITION BY le.player_id ORDER BY le.score DESC, le.played_at) AS rn
                    FROM leaderboard_entries le
                    JOIN players p ON p.id = le.player_id
                    WHERE le.game_type = ?
                ) best
                WHERE rn = 1
                ORDER BY score DESC
                LIMIT ?
                """,
                (rs, i) -> new UnifiedLeaderboardEntry(
                        rank.getAndIncrement(),
                        rs.getString("display_name"),
                        rs.getInt("score"),
                        parseMetadata(rs.getString("metadata"))
                ),
                gameType, limit);
    }

    @Override
    public List<PlayerProgress> findProgress() {
        return jdbc.query("""
                SELECT p.display_name, le.game_type, COUNT(*) AS plays, MAX(le.score) AS best_score
                FROM leaderboard_entries le
                JOIN players p ON p.id = le.player_id
                GROUP BY p.display_name, le.game_type
                ORDER BY p.display_name, le.game_type
                """,
                (rs, i) -> new PlayerProgress(
                        rs.getString("display_name"),
                        rs.getString("game_type"),
                        rs.getLong("plays"),
                        rs.getInt("best_score")
                ));
    }

    private Map<String, Object> parseMetadata(String json) {
        try {
            return objectMapper.readValue(json == null ? "{}" : json, new TypeReference<>() {});
        } catch (Exception e) {
            return Map.of();
        }
    }
}
