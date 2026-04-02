package dk.wordblitz.infrastructure.adapter.out.persistence;

import dk.wordblitz.domain.model.Word;
import dk.wordblitz.domain.port.out.WordRepository;
import dk.wordblitz.infrastructure.adapter.out.persistence.entity.WordEntity;
import dk.wordblitz.infrastructure.adapter.out.persistence.repository.WordJpaRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class WordPersistenceAdapter implements WordRepository {

    private final WordJpaRepository jpa;

    public WordPersistenceAdapter(WordJpaRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public Optional<Word> findById(Long id) {
        return jpa.findById(id).map(this::toDomain);
    }

    @Override
    public List<Word> findByCategoryIds(List<Long> categoryIds) {
        return jpa.findByCategoryIdIn(categoryIds).stream().map(this::toDomain).toList();
    }

    @Override
    public List<Word> findByCategoryId(Long categoryId) {
        return jpa.findByCategoryId(categoryId).stream().map(this::toDomain).toList();
    }

    @Override
    public Word save(Word word) {
        WordEntity entity = new WordEntity(word.id(), word.text(), word.categoryId());
        return toDomain(jpa.save(entity));
    }

    @Override
    public void deleteById(Long id) {
        jpa.deleteById(id);
    }

    private Word toDomain(WordEntity e) {
        return new Word(e.getId(), e.getText(), e.getCategoryId());
    }
}
