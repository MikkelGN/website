package dk.wordblitz.infrastructure.adapter.out.persistence;

import dk.wordblitz.domain.model.GameSession;
import dk.wordblitz.domain.model.LeaderboardEntry;
import dk.wordblitz.domain.port.out.GameSessionRepository;
import dk.wordblitz.infrastructure.adapter.out.persistence.entity.GameSessionEntity;
import dk.wordblitz.infrastructure.adapter.out.persistence.repository.GameSessionJpaRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class GameSessionPersistenceAdapter implements GameSessionRepository {

    private final GameSessionJpaRepository jpa;

    public GameSessionPersistenceAdapter(GameSessionJpaRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public GameSession save(GameSession session) {
        Long[] catIds = session.categoryIds().toArray(new Long[0]);
        GameSessionEntity entity = new GameSessionEntity(
                session.id(), session.userId(), catIds,
                session.startedAt(), session.completedAt(),
                session.totalScore(), session.correctAnswers(), session.maxStreak()
        );
        return toDomain(jpa.save(entity));
    }

    @Override
    public Optional<GameSession> findById(Long id) {
        return jpa.findById(id).map(this::toDomain);
    }

    @Override
    public List<LeaderboardEntry> findTopScores(int limit) {
        List<Object[]> rows = jpa.findTopScoresRaw(PageRequest.of(0, limit));
        AtomicInteger rank = new AtomicInteger(1);
        return rows.stream().map(row -> new LeaderboardEntry(
                rank.getAndIncrement(),
                (String) row[1],
                ((Number) row[2]).intValue(),
                ((Number) row[3]).intValue(),
                ((Number) row[4]).intValue()
        )).toList();
    }

    @Override
    public List<GameSession> findAllPaged(int page, int size) {
        return jpa.findAllByOrderByStartedAtDesc(PageRequest.of(page, size))
                .stream().map(this::toDomain).toList();
    }

    private GameSession toDomain(GameSessionEntity e) {
        List<Long> catIds = Arrays.asList(e.getCategoryIds());
        return new GameSession(e.getId(), e.getUserId(), catIds,
                e.getStartedAt(), e.getCompletedAt(),
                e.getTotalScore(), e.getCorrectAnswers(), e.getMaxStreak());
    }
}
