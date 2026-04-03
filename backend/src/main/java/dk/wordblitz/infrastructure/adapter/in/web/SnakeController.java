package dk.wordblitz.infrastructure.adapter.in.web;

import dk.wordblitz.domain.model.SnakeLeaderboardEntry;
import dk.wordblitz.domain.port.in.SnakeUseCase;
import io.jsonwebtoken.Claims;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/snake")
public class SnakeController {

    private final SnakeUseCase snakeUseCase;

    public SnakeController(SnakeUseCase snakeUseCase) {
        this.snakeUseCase = snakeUseCase;
    }

    record SubmitScoreRequest(int score) {}

    @PostMapping("/scores")
    public ResponseEntity<Void> submitScore(@RequestBody SubmitScoreRequest req, Authentication auth) {
        Claims claims = (Claims) auth.getDetails();
        Long userId = Long.valueOf(claims.getSubject());
        snakeUseCase.submitScore(new SnakeUseCase.SubmitScoreCommand(userId, req.score()));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/leaderboard")
    public List<SnakeLeaderboardEntry> getLeaderboard(@RequestParam(defaultValue = "20") int limit) {
        return snakeUseCase.getLeaderboard(limit);
    }
}
