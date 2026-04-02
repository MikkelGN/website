package dk.wordblitz.infrastructure.adapter.out.persistence.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "game_answers")
public class GameAnswerEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "session_id", nullable = false)
    private Long sessionId;

    @Column(name = "word_id", nullable = false)
    private Long wordId;

    @Column(name = "chosen_category", nullable = false)
    private Long chosenCategoryId;

    @Column(nullable = false)
    private boolean correct;

    @Column(name = "time_remaining", nullable = false)
    private double timeRemaining;

    @Column(name = "points_earned", nullable = false)
    private int pointsEarned;

    @Column(name = "streak_at_answer", nullable = false)
    private int streakAtAnswer;

    @Column(name = "answered_at", nullable = false)
    private Instant answeredAt;

    protected GameAnswerEntity() {}

    public GameAnswerEntity(Long id, Long sessionId, Long wordId, Long chosenCategoryId,
                            boolean correct, double timeRemaining, int pointsEarned,
                            int streakAtAnswer, Instant answeredAt) {
        this.id = id;
        this.sessionId = sessionId;
        this.wordId = wordId;
        this.chosenCategoryId = chosenCategoryId;
        this.correct = correct;
        this.timeRemaining = timeRemaining;
        this.pointsEarned = pointsEarned;
        this.streakAtAnswer = streakAtAnswer;
        this.answeredAt = answeredAt;
    }

    public Long getId() { return id; }
    public Long getSessionId() { return sessionId; }
    public Long getWordId() { return wordId; }
    public Long getChosenCategoryId() { return chosenCategoryId; }
    public boolean isCorrect() { return correct; }
    public double getTimeRemaining() { return timeRemaining; }
    public int getPointsEarned() { return pointsEarned; }
    public int getStreakAtAnswer() { return streakAtAnswer; }
    public Instant getAnsweredAt() { return answeredAt; }
}
