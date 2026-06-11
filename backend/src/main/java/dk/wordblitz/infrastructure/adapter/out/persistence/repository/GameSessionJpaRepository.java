package dk.wordblitz.infrastructure.adapter.out.persistence.repository;

import dk.wordblitz.infrastructure.adapter.out.persistence.entity.GameSessionEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GameSessionJpaRepository extends JpaRepository<GameSessionEntity, Long> {


    List<GameSessionEntity> findAllByOrderByStartedAtDesc(Pageable pageable);
}
