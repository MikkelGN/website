package dk.wordblitz.infrastructure.adapter.out.persistence;

import dk.wordblitz.domain.model.TetrisLeaderboardEntry;
import dk.wordblitz.domain.model.TetrisScore;
import dk.wordblitz.domain.port.out.TetrisScoreRepository;
import dk.wordblitz.infrastructure.adapter.out.persistence.entity.TetrisScoreEntity;
import dk.wordblitz.infrastructure.adapter.out.persistence.repository.TetrisScoreJpaRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

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

    @Override
    public List<TetrisLeaderboardEntry> findTopScores(int limit) {
        List<Object[]> rows = jpa.findTopScoresRaw(PageRequest.of(0, limit));
        AtomicInteger rank = new AtomicInteger(1);
        return rows.stream().map(row -> new TetrisLeaderboardEntry(
                rank.getAndIncrement(),
                (String) row[0],
                ((Number) row[1]).intValue(),
                ((Number) row[2]).intValue(),
                ((Number) row[3]).intValue()
        )).toList();
    }
}
