package dk.wordblitz.infrastructure.adapter.in.web;

import dk.wordblitz.domain.model.AppUser;
import dk.wordblitz.domain.port.in.AuthUseCase;
import dk.wordblitz.infrastructure.security.JwtService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthUseCase authUseCase;
    private final JwtService jwtService;

    public AuthController(AuthUseCase authUseCase, JwtService jwtService) {
        this.authUseCase = authUseCase;
        this.jwtService = jwtService;
    }

    record LoginRequest(@NotBlank @Size(min = 2, max = 30) String username) {}
    record LoginResponse(String token, Long userId, String username) {}

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        AppUser user = authUseCase.loginOrCreate(request.username().trim());
        String token = jwtService.generatePlayerToken(user.id(), user.username());
        return ResponseEntity.ok(new LoginResponse(token, user.id(), user.username()));
    }
}
