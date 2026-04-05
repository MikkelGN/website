package dk.wordblitz.infrastructure.adapter.out.persistence.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "tetris_scores")
public class TetrisScoreEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private int score;

    @Column(nullable = false)
    private int level;

    @Column(nullable = false)
    private int lines;

    @Column(name = "played_at", nullable = false)
    private Instant playedAt;

    protected TetrisScoreEntity() {}

    public TetrisScoreEntity(Long id, Long userId, int score, int level, int lines, Instant playedAt) {
        this.id = id;
        this.userId = userId;
        this.score = score;
        this.level = level;
        this.lines = lines;
        this.playedAt = playedAt;
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public int getScore() { return score; }
    public int getLevel() { return level; }
    public int getLines() { return lines; }
    public Instant getPlayedAt() { return playedAt; }
}
