package dk.wordblitz.infrastructure.adapter.out.persistence.repository;

import dk.wordblitz.infrastructure.adapter.out.persistence.entity.TetrisScoreEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TetrisScoreJpaRepository extends JpaRepository<TetrisScoreEntity, Long> {

    @Query("""
            SELECT u.username, MAX(s.score), MAX(s.level), MAX(s.lines)
            FROM TetrisScoreEntity s
            JOIN UserEntity u ON u.id = s.userId
            GROUP BY u.username
            ORDER BY MAX(s.score) DESC
            """)
    List<Object[]> findTopScoresRaw(Pageable pageable);
}
