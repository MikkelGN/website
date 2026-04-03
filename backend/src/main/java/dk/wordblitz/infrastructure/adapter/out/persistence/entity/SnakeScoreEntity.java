package dk.wordblitz.infrastructure.adapter.out.persistence.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "snake_scores")
public class SnakeScoreEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private int score;

    @Column(name = "played_at", nullable = false)
    private Instant playedAt;

    protected SnakeScoreEntity() {}

    public SnakeScoreEntity(Long id, Long userId, int score, Instant playedAt) {
        this.id = id;
        this.userId = userId;
        this.score = score;
        this.playedAt = playedAt;
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public int getScore() { return score; }
    public Instant getPlayedAt() { return playedAt; }
}
