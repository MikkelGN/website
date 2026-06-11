package dk.wordblitz.infrastructure.adapter.out.persistence;

import dk.wordblitz.domain.model.MathScore;
import dk.wordblitz.domain.port.out.MathScoreRepository;
import dk.wordblitz.infrastructure.adapter.out.persistence.entity.MathScoreEntity;
import dk.wordblitz.infrastructure.adapter.out.persistence.repository.MathScoreJpaRepository;
import org.springframework.stereotype.Component;


@Component
public class MathScorePersistenceAdapter implements MathScoreRepository {

    private final MathScoreJpaRepository jpa;

    public MathScorePersistenceAdapter(MathScoreJpaRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public MathScore save(MathScore score) {
        MathScoreEntity saved = jpa.save(new MathScoreEntity(
                null, score.userId(), score.score(), score.difficulty(), score.playedAt()));
        return new MathScore(saved.getId(), saved.getUserId(), saved.getScore(),
                saved.getDifficulty(), saved.getPlayedAt());
    }

}
