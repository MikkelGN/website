package dk.wordblitz.infrastructure.adapter.out.persistence.repository;

import dk.wordblitz.infrastructure.adapter.out.persistence.entity.VocabularyWordEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VocabularyWordJpaRepository extends JpaRepository<VocabularyWordEntity, Long> {
    List<VocabularyWordEntity> findByCategory(String category);
}
