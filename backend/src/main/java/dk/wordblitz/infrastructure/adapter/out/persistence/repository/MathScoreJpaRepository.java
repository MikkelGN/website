package dk.wordblitz.infrastructure.adapter.out.persistence.repository;

import dk.wordblitz.infrastructure.adapter.out.persistence.entity.MathScoreEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MathScoreJpaRepository extends JpaRepository<MathScoreEntity, Long> {
}
