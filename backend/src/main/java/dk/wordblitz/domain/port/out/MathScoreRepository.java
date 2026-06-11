package dk.wordblitz.domain.port.out;

import dk.wordblitz.domain.model.MathScore;

public interface MathScoreRepository {
    MathScore save(MathScore score);
}
