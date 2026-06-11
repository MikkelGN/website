package dk.wordblitz.infrastructure.adapter.out.persistence.repository;

import dk.wordblitz.infrastructure.adapter.out.persistence.entity.TetrisScoreEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TetrisScoreJpaRepository extends JpaRepository<TetrisScoreEntity, Long> {
}
