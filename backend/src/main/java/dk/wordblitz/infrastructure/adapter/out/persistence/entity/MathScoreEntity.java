package dk.wordblitz.infrastructure.adapter.out.persistence.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "math_scores")
public class MathScoreEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private int score;

    @Column(nullable = false)
    private String difficulty;

    @Column(name = "played_at", nullable = false)
    private Instant playedAt;

    protected MathScoreEntity() {}

    public MathScoreEntity(Long id, Long userId, int score, String difficulty, Instant playedAt) {
        this.id = id;
        this.userId = userId;
        this.score = score;
        this.difficulty = difficulty;
        this.playedAt = playedAt;
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public int getScore() { return score; }
    public String getDifficulty() { return difficulty; }
    public Instant getPlayedAt() { return playedAt; }
}
