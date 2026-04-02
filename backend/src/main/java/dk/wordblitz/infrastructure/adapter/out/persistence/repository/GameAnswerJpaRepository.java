package dk.wordblitz.infrastructure.adapter.out.persistence.repository;

import dk.wordblitz.infrastructure.adapter.out.persistence.entity.GameAnswerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GameAnswerJpaRepository extends JpaRepository<GameAnswerEntity, Long> {

    List<GameAnswerEntity> findBySessionIdOrderByAnsweredAtAsc(Long sessionId);

    @Query("SELECT COUNT(a) FROM GameAnswerEntity a WHERE a.sessionId = :sessionId AND a.correct = true")
    int countCorrectBySessionId(@Param("sessionId") Long sessionId);

    @Query("""
            SELECT COUNT(a) FROM GameAnswerEntity a
            WHERE a.sessionId = :sessionId
              AND a.id > COALESCE(
                (SELECT MAX(a2.id) FROM GameAnswerEntity a2
                 WHERE a2.sessionId = :sessionId AND a2.correct = false), 0
              )
              AND a.correct = true
            """)
    int getCurrentStreakForSession(@Param("sessionId") Long sessionId);
}
