package dk.wordblitz.infrastructure.adapter.out.persistence.repository;

import dk.wordblitz.infrastructure.adapter.out.persistence.entity.WordEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WordJpaRepository extends JpaRepository<WordEntity, Long> {

    List<WordEntity> findByCategoryId(Long categoryId);

    @Query("SELECT w FROM WordEntity w WHERE w.categoryId IN :categoryIds")
    List<WordEntity> findByCategoryIdIn(@Param("categoryIds") List<Long> categoryIds);
}
