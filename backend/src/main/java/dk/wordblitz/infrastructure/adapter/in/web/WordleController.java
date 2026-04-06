package dk.wordblitz.infrastructure.adapter.in.web;

import dk.wordblitz.application.service.WordleSuggestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wordle")
public class WordleController {

    private final WordleSuggestionService suggestionService;

    public WordleController(WordleSuggestionService suggestionService) {
        this.suggestionService = suggestionService;
    }

    record SuggestionsRequest(List<WordleSuggestionService.GuessDto> guesses) {}

    @PostMapping("/suggestions")
    public ResponseEntity<?> getSuggestions(@RequestBody SuggestionsRequest request) {
        List<String> words = suggestionService.getSuggestions(request.guesses());
        return ResponseEntity.ok(Map.of("words", words, "count", words.size()));
    }
}
