package dk.wordblitz.domain.port.out;

import dk.wordblitz.domain.model.SnakeScore;

public interface SnakeScoreRepository {
    SnakeScore save(SnakeScore score);
}
