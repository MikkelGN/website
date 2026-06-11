package dk.wordblitz.infrastructure.adapter.in.web;

import dk.wordblitz.domain.model.Player;
import dk.wordblitz.domain.port.in.AuthUseCase;
import dk.wordblitz.infrastructure.security.JwtService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthUseCase authUseCase;
    private final JwtService jwtService;

    public AuthController(AuthUseCase authUseCase, JwtService jwtService) {
        this.authUseCase = authUseCase;
        this.jwtService = jwtService;
    }

    record PlayerSummary(Long id, String displayName, String avatarKey) {}
    record PinLoginRequest(@NotBlank @Pattern(regexp = "\\d{4}") String pin) {}
    record LoginResponse(String token, Long playerId, String displayName, String avatarKey) {}

    @GetMapping("/players")
    public List<PlayerSummary> listPlayers() {
        return authUseCase.listPlayers().stream()
                .map(p -> new PlayerSummary(p.id(), p.displayName(), p.avatarKey()))
                .toList();
    }

    @PostMapping("/players/{id}/login")
    public ResponseEntity<LoginResponse> login(@PathVariable Long id,
                                               @Valid @RequestBody PinLoginRequest request) {
        Player player = authUseCase.login(id, request.pin());
        String token = jwtService.generatePlayerToken(player.id(), player.displayName());
        return ResponseEntity.ok(new LoginResponse(token, player.id(), player.displayName(), player.avatarKey()));
    }
}
