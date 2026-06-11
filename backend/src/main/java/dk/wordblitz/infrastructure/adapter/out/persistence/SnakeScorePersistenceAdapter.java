package dk.wordblitz.infrastructure.adapter.out.persistence;

import dk.wordblitz.domain.model.SnakeScore;
import dk.wordblitz.domain.port.out.SnakeScoreRepository;
import dk.wordblitz.infrastructure.adapter.out.persistence.entity.SnakeScoreEntity;
import dk.wordblitz.infrastructure.adapter.out.persistence.repository.SnakeScoreJpaRepository;
import org.springframework.stereotype.Component;


@Component
public class SnakeScorePersistenceAdapter implements SnakeScoreRepository {

    private final SnakeScoreJpaRepository jpa;

    public SnakeScorePersistenceAdapter(SnakeScoreJpaRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public SnakeScore save(SnakeScore score) {
        SnakeScoreEntity saved = jpa.save(
                new SnakeScoreEntity(null, score.userId(), score.score(), score.playedAt())
        );
        return new SnakeScore(saved.getId(), saved.getUserId(), saved.getScore(), saved.getPlayedAt());
    }

}
