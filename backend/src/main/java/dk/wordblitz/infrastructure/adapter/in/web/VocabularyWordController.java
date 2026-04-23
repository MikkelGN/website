package dk.wordblitz.infrastructure.adapter.in.web;

import dk.wordblitz.infrastructure.adapter.out.persistence.repository.VocabularyWordJpaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/words")
@CrossOrigin("*")
public class VocabularyWordController {

    private final VocabularyWordJpaRepository repository;

    public VocabularyWordController(VocabularyWordJpaRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Map<String, String>> getWords(@RequestParam(required = false) String category) {
        var entities = category != null
                ? repository.findByCategory(category)
                : repository.findAll();

        return entities.stream()
                .map(e -> Map.of(
                        "russian",  e.getRussian(),
                        "danish",   e.getDanish(),
                        "category", e.getCategory()
                ))
                .toList();
    }
}
