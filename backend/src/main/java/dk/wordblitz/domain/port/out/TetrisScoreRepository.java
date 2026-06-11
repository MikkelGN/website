package dk.wordblitz.domain.port.out;

import dk.wordblitz.domain.model.TetrisScore;

public interface TetrisScoreRepository {
    TetrisScore save(TetrisScore score);
}
