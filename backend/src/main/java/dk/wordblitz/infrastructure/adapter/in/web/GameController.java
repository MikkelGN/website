package dk.wordblitz.infrastructure.adapter.in.web;

import dk.wordblitz.domain.model.Category;
import dk.wordblitz.domain.model.GameSession;
import dk.wordblitz.domain.port.in.GameUseCase;
import dk.wordblitz.domain.port.in.GetCategoriesUseCase;
import io.jsonwebtoken.Claims;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class GameController {

    private final GetCategoriesUseCase getCategoriesUseCase;
    private final GameUseCase gameUseCase;

    public GameController(GetCategoriesUseCase getCategoriesUseCase, GameUseCase gameUseCase) {
        this.getCategoriesUseCase = getCategoriesUseCase;
        this.gameUseCase = gameUseCase;
    }

    record CategoryResponse(Long id, String nameDa, String nameEn, String color) {}

    record StartSessionRequest(
            @NotEmpty @Size(min = 2, message = "Select at least 2 categories")
            List<Long> categoryIds
    ) {}

    record StartSessionResponse(Long sessionId, double startingTimeLimit) {}

    record NextWordResponse(Long wordId, String wordText, List<Long> categoryIds) {}

    record AnswerRequest(Long wordId, Long chosenCategoryId, double timeRemaining) {}

    record AnswerResponse(boolean correct, int pointsEarned, int totalScore,
                          int streak, double nextTimeLimit, boolean gameOver) {}

    @GetMapping("/categories")
    public List<CategoryResponse> getCategories() {
        return getCategoriesUseCase.getAllCategories().stream()
                .map(c -> new CategoryResponse(c.id(), c.nameDa(), c.nameEn(), c.color()))
                .toList();
    }

    @PostMapping("/sessions")
    public ResponseEntity<StartSessionResponse> startSession(@Valid @RequestBody StartSessionRequest req,
                                                             Authentication auth) {
        Long userId = extractUserId(auth);
        GameSession session = gameUseCase.startSession(
                new GameUseCase.StartSessionCommand(userId, req.categoryIds())
        );
        return ResponseEntity.ok(new StartSessionResponse(session.id(), 10.0));
    }

    @GetMapping("/sessions/{sessionId}/next-word")
    public ResponseEntity<NextWordResponse> getNextWord(@PathVariable Long sessionId) {
        GameUseCase.NextWordResult result = gameUseCase.getNextWord(sessionId);
        return ResponseEntity.ok(new NextWordResponse(result.wordId(), result.wordText(), result.categoryIds()));
    }

    @PostMapping("/sessions/{sessionId}/answers")
    public ResponseEntity<AnswerResponse> submitAnswer(@PathVariable Long sessionId,
                                                       @RequestBody AnswerRequest req) {
        GameUseCase.AnswerResult result = gameUseCase.submitAnswer(
                new GameUseCase.AnswerCommand(sessionId, req.wordId(), req.chosenCategoryId(), req.timeRemaining())
        );
        return ResponseEntity.ok(new AnswerResponse(
                result.correct(), result.pointsEarned(), result.totalScore(),
                result.streak(), result.nextTimeLimit(), result.gameOver()
        ));
    }

    @PostMapping("/sessions/{sessionId}/complete")
    public ResponseEntity<Void> completeSession(@PathVariable Long sessionId) {
        gameUseCase.completeSession(sessionId);
        return ResponseEntity.ok().build();
    }

    private Long extractUserId(Authentication auth) {
        Claims claims = (Claims) auth.getDetails();
        return Long.valueOf(claims.getSubject());
    }
}
