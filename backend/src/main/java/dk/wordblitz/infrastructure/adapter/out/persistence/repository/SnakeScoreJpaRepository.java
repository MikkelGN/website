package dk.wordblitz.infrastructure.adapter.out.persistence.repository;

import dk.wordblitz.infrastructure.adapter.out.persistence.entity.SnakeScoreEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SnakeScoreJpaRepository extends JpaRepository<SnakeScoreEntity, Long> {
}
