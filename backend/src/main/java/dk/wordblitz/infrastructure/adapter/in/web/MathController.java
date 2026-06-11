package dk.wordblitz.infrastructure.adapter.in.web;

import dk.wordblitz.domain.port.in.MathUseCase;
import io.jsonwebtoken.Claims;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/math")
public class MathController {

    private final MathUseCase mathUseCase;

    public MathController(MathUseCase mathUseCase) {
        this.mathUseCase = mathUseCase;
    }

    record SubmitScoreRequest(int score, String difficulty) {}

    @PostMapping("/scores")
    public ResponseEntity<Void> submitScore(@RequestBody SubmitScoreRequest req, Authentication auth) {
        Claims claims = (Claims) auth.getDetails();
        Long userId = Long.valueOf(claims.getSubject());
        mathUseCase.submitScore(new MathUseCase.SubmitScoreCommand(userId, req.score(), req.difficulty()));
        return ResponseEntity.ok().build();
    }

}
