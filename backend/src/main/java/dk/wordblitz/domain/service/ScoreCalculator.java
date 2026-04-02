package dk.wordblitz.domain.service;

import org.springframework.stereotype.Component;

@Component
public class ScoreCalculator {

    private static final int BASE_POINTS = 100;
    private static final double STARTING_TIME = 10.0;
    private static final double MIN_TIME = 2.0;
    private static final double TIME_REDUCTION_FACTOR = 0.9;

    /**
     * Calculate points for a correct answer.
     * Points = base * streakMultiplier * timeBonus
     */
    public int calculatePoints(double timeRemaining, double timeLimit, int streak) {
        double streakMultiplier = 1.0 + (streak * 0.1);
        double timeBonus = timeRemaining / timeLimit;
        return (int) Math.round(BASE_POINTS * streakMultiplier * timeBonus);
    }

    /**
     * Calculate the next time limit after a correct answer.
     * Each correct answer shrinks the available time by 10%, floored at MIN_TIME.
     */
    public double nextTimeLimit(double currentTimeLimit) {
        return Math.max(currentTimeLimit * TIME_REDUCTION_FACTOR, MIN_TIME);
    }

    public double startingTimeLimit() {
        return STARTING_TIME;
    }
}
