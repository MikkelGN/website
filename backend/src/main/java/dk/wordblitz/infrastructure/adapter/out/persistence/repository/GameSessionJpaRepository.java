package dk.wordblitz.infrastructure.adapter.out.persistence.repository;

import dk.wordblitz.infrastructure.adapter.out.persistence.entity.GameSessionEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GameSessionJpaRepository extends JpaRepository<GameSessionEntity, Long> {

    @Query("""
            SELECT s.id, u.username, SUM(s.totalScore), SUM(s.correctAnswers), MAX(s.maxStreak)
            FROM GameSessionEntity s
            JOIN UserEntity u ON u.id = s.userId
            WHERE s.completedAt IS NOT NULL
            GROUP BY s.id, u.username
            ORDER BY SUM(s.totalScore) DESC
            """)
    List<Object[]> findTopScoresRaw(Pageable pageable);

    List<GameSessionEntity> findAllByOrderByStartedAtDesc(Pageable pageable);
}
