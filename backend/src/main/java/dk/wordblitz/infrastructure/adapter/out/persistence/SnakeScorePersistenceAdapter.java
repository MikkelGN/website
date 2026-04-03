package dk.wordblitz.infrastructure.adapter.out.persistence;

import dk.wordblitz.domain.model.SnakeLeaderboardEntry;
import dk.wordblitz.domain.model.SnakeScore;
import dk.wordblitz.domain.port.out.SnakeScoreRepository;
import dk.wordblitz.infrastructure.adapter.out.persistence.entity.SnakeScoreEntity;
import dk.wordblitz.infrastructure.adapter.out.persistence.repository.SnakeScoreJpaRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

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

    @Override
    public List<SnakeLeaderboardEntry> findTopScores(int limit) {
        List<Object[]> rows = jpa.findTopScoresRaw(PageRequest.of(0, limit));
        AtomicInteger rank = new AtomicInteger(1);
        return rows.stream().map(row -> new SnakeLeaderboardEntry(
                rank.getAndIncrement(),
                (String) row[0],
                ((Number) row[1]).intValue()
        )).toList();
    }
}
