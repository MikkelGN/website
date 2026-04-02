package dk.wordblitz.infrastructure.adapter.out.persistence.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "game_sessions")
public class GameSessionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "category_ids", columnDefinition = "bigint[]")
    private Long[] categoryIds;

    @Column(name = "started_at", nullable = false)
    private Instant startedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @Column(name = "total_score", nullable = false)
    private int totalScore;

    @Column(name = "correct_answers", nullable = false)
    private int correctAnswers;

    @Column(name = "max_streak", nullable = false)
    private int maxStreak;

    protected GameSessionEntity() {}

    public GameSessionEntity(Long id, Long userId, Long[] categoryIds, Instant startedAt,
                             Instant completedAt, int totalScore, int correctAnswers, int maxStreak) {
        this.id = id;
        this.userId = userId;
        this.categoryIds = categoryIds;
        this.startedAt = startedAt;
        this.completedAt = completedAt;
        this.totalScore = totalScore;
        this.correctAnswers = correctAnswers;
        this.maxStreak = maxStreak;
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public Long[] getCategoryIds() { return categoryIds; }
    public Instant getStartedAt() { return startedAt; }
    public Instant getCompletedAt() { return completedAt; }
    public int getTotalScore() { return totalScore; }
    public int getCorrectAnswers() { return correctAnswers; }
    public int getMaxStreak() { return maxStreak; }
    public void setTotalScore(int totalScore) { this.totalScore = totalScore; }
    public void setCorrectAnswers(int correctAnswers) { this.correctAnswers = correctAnswers; }
    public void setMaxStreak(int maxStreak) { this.maxStreak = maxStreak; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }
}
