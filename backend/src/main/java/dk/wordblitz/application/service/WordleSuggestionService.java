package dk.wordblitz.application.service;

import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class WordleSuggestionService {

    private List<String> wordList = new ArrayList<>();

    public record GuessDto(String word, List<String> colors) {}

    @PostConstruct
    public void loadWords() {
        try (var reader = new BufferedReader(new InputStreamReader(
                new ClassPathResource("words/danish5.txt").getInputStream()))) {
            wordList = reader.lines()
                    .map(String::trim)
                    .map(String::toUpperCase)
                    .filter(w -> w.length() == 5)
                    .distinct()
                    .sorted()
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Could not load Danish word list: " + e.getMessage());
        }
    }

    public List<String> getSuggestions(List<GuessDto> guesses) {
        if (guesses == null || guesses.isEmpty()) return Collections.emptyList();
        return wordList.stream()
                .filter(w -> matchesConstraints(w, guesses))
                .collect(Collectors.toList());
    }

    private boolean matchesConstraints(String word, List<GuessDto> guesses) {
        String w = word.toUpperCase();

        for (GuessDto guess : guesses) {
            if (guess.word() == null || guess.word().trim().length() != 5) continue;
            String g = guess.word().toUpperCase();
            List<String> colors = guess.colors();
            if (colors == null || colors.size() != 5) continue;

            // Green: exact position match
            for (int i = 0; i < 5; i++) {
                if ("green".equals(colors.get(i)) && w.charAt(i) != g.charAt(i)) return false;
            }

            // Yellow: letter present but not at this position
            for (int i = 0; i < 5; i++) {
                if ("yellow".equals(colors.get(i))) {
                    if (w.indexOf(g.charAt(i)) < 0) return false;
                    if (w.charAt(i) == g.charAt(i)) return false;
                }
            }

            // Gray: max occurrence constraint (handles repeated letters correctly)
            Set<Character> processedGray = new HashSet<>();
            for (int i = 0; i < 5; i++) {
                if ("gray".equals(colors.get(i))) {
                    char c = g.charAt(i);
                    if (processedGray.add(c)) {
                        int maxAllowed = 0;
                        for (int j = 0; j < 5; j++) {
                            if (g.charAt(j) == c && !"gray".equals(colors.get(j))) maxAllowed++;
                        }
                        long cnt = w.chars().filter(x -> x == c).count();
                        if (cnt > maxAllowed) return false;
                    }
                }
            }

            // Min occurrence constraint (from green + yellow)
            Map<Character, Integer> minNeeded = new HashMap<>();
            for (int i = 0; i < 5; i++) {
                char c = g.charAt(i);
                if ("green".equals(colors.get(i)) || "yellow".equals(colors.get(i))) {
                    minNeeded.merge(c, 1, Integer::sum);
                }
            }
            for (Map.Entry<Character, Integer> e : minNeeded.entrySet()) {
                long cnt = w.chars().filter(x -> x == e.getKey()).count();
                if (cnt < e.getValue()) return false;
            }
        }

        return true;
    }
}
