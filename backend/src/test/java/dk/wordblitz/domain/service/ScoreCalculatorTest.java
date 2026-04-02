package dk.wordblitz.domain.service;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ScoreCalculatorTest {

    private final ScoreCalculator calculator = new ScoreCalculator();

    @Test
    void fullTimeNoStreakGivesBasePoints() {
        int points = calculator.calculatePoints(10.0, 10.0, 0);
        assertThat(points).isEqualTo(100);
    }

    @Test
    void halfTimeGivesHalfPoints() {
        int points = calculator.calculatePoints(5.0, 10.0, 0);
        assertThat(points).isEqualTo(50);
    }

    @Test
    void streakIncreasesPoints() {
        int noStreak = calculator.calculatePoints(10.0, 10.0, 0);
        int withStreak = calculator.calculatePoints(10.0, 10.0, 5);
        assertThat(withStreak).isGreaterThan(noStreak);
    }

    @Test
    void timeLimitDecreasesWithCorrectAnswers() {
        double time = calculator.startingTimeLimit();
        double next = calculator.nextTimeLimit(time);
        assertThat(next).isLessThan(time);
    }

    @Test
    void timeLimitNeverGoesBelowFloor() {
        double time = 0.1; // well below min
        assertThat(calculator.nextTimeLimit(time)).isGreaterThanOrEqualTo(2.0);
    }
}
