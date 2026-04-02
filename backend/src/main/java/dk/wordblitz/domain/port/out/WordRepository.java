package dk.wordblitz.domain.port.out;

import dk.wordblitz.domain.model.Word;

import java.util.List;
import java.util.Optional;

public interface WordRepository {
    Optional<Word> findById(Long id);
    List<Word> findByCategoryIds(List<Long> categoryIds);
    List<Word> findByCategoryId(Long categoryId);
    Word save(Word word);
    void deleteById(Long id);
}
