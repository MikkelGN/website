package dk.wordblitz.infrastructure.adapter.out.persistence;

import dk.wordblitz.domain.model.TetrisScore;
import dk.wordblitz.domain.port.out.TetrisScoreRepository;
import dk.wordblitz.infrastructure.adapter.out.persistence.entity.TetrisScoreEntity;
import dk.wordblitz.infrastructure.adapter.out.persistence.repository.TetrisScoreJpaRepository;
import org.springframework.stereotype.Component;


@Component
public class TetrisScorePersistenceAdapter implements TetrisScoreRepository {

    private final TetrisScoreJpaRepository jpa;

    public TetrisScorePersistenceAdapter(TetrisScoreJpaRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public TetrisScore save(TetrisScore score) {
        TetrisScoreEntity saved = jpa.save(new TetrisScoreEntity(
                null, score.userId(), score.score(), score.level(), score.lines(), score.playedAt()
        ));
        return new TetrisScore(saved.getId(), saved.getUserId(), saved.getScore(),
                saved.getLevel(), saved.getLines(), saved.getPlayedAt());
    }

}
