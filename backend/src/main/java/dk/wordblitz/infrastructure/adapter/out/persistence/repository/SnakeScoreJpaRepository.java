package dk.wordblitz.infrastructure.adapter.out.persistence.repository;

import dk.wordblitz.infrastructure.adapter.out.persistence.entity.SnakeScoreEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SnakeScoreJpaRepository extends JpaRepository<SnakeScoreEntity, Long> {

    @Query("""
            SELECT u.username, MAX(s.score)
            FROM SnakeScoreEntity s
            JOIN UserEntity u ON u.id = s.userId
            GROUP BY u.username
            ORDER BY MAX(s.score) DESC
            """)
    List<Object[]> findTopScoresRaw(Pageable pageable);
}
