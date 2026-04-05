package dk.wordblitz.infrastructure.adapter.in.web;

import dk.wordblitz.domain.model.TetrisLeaderboardEntry;
import dk.wordblitz.domain.port.in.TetrisUseCase;
import io.jsonwebtoken.Claims;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tetris")
public class TetrisController {

    private final TetrisUseCase tetrisUseCase;

    public TetrisController(TetrisUseCase tetrisUseCase) {
        this.tetrisUseCase = tetrisUseCase;
    }

    record SubmitScoreRequest(int score, int level, int lines) {}

    @PostMapping("/scores")
    public ResponseEntity<Void> submitScore(@RequestBody SubmitScoreRequest req, Authentication auth) {
        Claims claims = (Claims) auth.getDetails();
        Long userId = Long.valueOf(claims.getSubject());
        tetrisUseCase.submitScore(new TetrisUseCase.SubmitScoreCommand(userId, req.score(), req.level(), req.lines()));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/leaderboard")
    public List<TetrisLeaderboardEntry> getLeaderboard(@RequestParam(defaultValue = "20") int limit) {
        return tetrisUseCase.getLeaderboard(limit);
    }
}
