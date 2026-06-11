package dk.wordblitz.infrastructure.adapter.in.web;

import dk.wordblitz.domain.model.Player;
import dk.wordblitz.domain.model.PlayerProgress;
import dk.wordblitz.domain.model.Category;
import dk.wordblitz.domain.model.GameSession;
import dk.wordblitz.domain.model.Word;
import dk.wordblitz.domain.port.in.AdminUseCase;
import dk.wordblitz.domain.port.in.GetCategoriesUseCase;
import dk.wordblitz.domain.port.in.LeaderboardUseCase;
import dk.wordblitz.infrastructure.security.JwtService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminUseCase adminUseCase;
    private final GetCategoriesUseCase getCategoriesUseCase;
    private final LeaderboardUseCase leaderboardUseCase;
    private final JwtService jwtService;
    private final String adminUsername;
    private final String adminPassword;

    public AdminController(AdminUseCase adminUseCase, GetCategoriesUseCase getCategoriesUseCase,
                           LeaderboardUseCase leaderboardUseCase, JwtService jwtService,
                           @Value("${app.admin.username}") String adminUsername,
                           @Value("${app.admin.password}") String adminPassword) {
        this.adminUseCase = adminUseCase;
        this.getCategoriesUseCase = getCategoriesUseCase;
        this.leaderboardUseCase = leaderboardUseCase;
        this.jwtService = jwtService;
        this.adminUsername = adminUsername;
        this.adminPassword = adminPassword;
    }

    // --- Auth ---
    record AdminLoginRequest(@NotBlank String username, @NotBlank String password) {}
    record AdminLoginResponse(String token) {}

    @PostMapping("/auth")
    public ResponseEntity<AdminLoginResponse> adminLogin(@Valid @RequestBody AdminLoginRequest req) {
        if (!adminUsername.equals(req.username()) || !adminPassword.equals(req.password())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }
        String token = jwtService.generateAdminToken(req.username());
        return ResponseEntity.ok(new AdminLoginResponse(token));
    }

    // --- Categories ---
    record CategoryRequest(@NotBlank String nameDa, @NotBlank String nameEn, String color) {}

    @GetMapping("/categories")
    public List<Category> getCategories() {
        return getCategoriesUseCase.getAllCategories();
    }

    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(@Valid @RequestBody CategoryRequest req) {
        Category category = adminUseCase.createCategory(
                new AdminUseCase.CreateCategoryCommand(req.nameDa(), req.nameEn(),
                        req.color() != null ? req.color() : "#ff00ff")
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(category);
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id,
                                                   @Valid @RequestBody CategoryRequest req) {
        Category category = adminUseCase.updateCategory(
                new AdminUseCase.UpdateCategoryCommand(id, req.nameDa(), req.nameEn(),
                        req.color() != null ? req.color() : "#ff00ff")
        );
        return ResponseEntity.ok(category);
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        adminUseCase.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    // --- Words ---
    record WordRequest(@NotBlank String text, @NotNull Long categoryId) {}

    @GetMapping("/words")
    public List<Word> getWordsByCategory(@RequestParam Long categoryId) {
        return adminUseCase.getWordsByCategory(categoryId);
    }

    @PostMapping("/words")
    public ResponseEntity<Word> createWord(@Valid @RequestBody WordRequest req) {
        Word word = adminUseCase.createWord(new AdminUseCase.CreateWordCommand(req.text(), req.categoryId()));
        return ResponseEntity.status(HttpStatus.CREATED).body(word);
    }

    @PutMapping("/words/{id}")
    public ResponseEntity<Word> updateWord(@PathVariable Long id, @Valid @RequestBody WordRequest req) {
        Word word = adminUseCase.updateWord(new AdminUseCase.UpdateWordCommand(id, req.text(), req.categoryId()));
        return ResponseEntity.ok(word);
    }

    @DeleteMapping("/words/{id}")
    public ResponseEntity<Void> deleteWord(@PathVariable Long id) {
        adminUseCase.deleteWord(id);
        return ResponseEntity.noContent().build();
    }

    // --- Players ---
    record PlayerRequest(@NotBlank String displayName, @NotBlank String avatarKey,
                         @Pattern(regexp = "\\d{4}") String pin) {}
    record PinRequest(@NotBlank @Pattern(regexp = "\\d{4}") String pin) {}
    record PlayerResponse(Long id, String displayName, String avatarKey, java.time.Instant createdAt) {}

    private static PlayerResponse toResponse(Player p) {
        return new PlayerResponse(p.id(), p.displayName(), p.avatarKey(), p.createdAt());
    }

    @GetMapping("/players")
    public List<PlayerResponse> getPlayers() {
        return adminUseCase.getAllPlayers().stream().map(AdminController::toResponse).toList();
    }

    @PostMapping("/players")
    public ResponseEntity<PlayerResponse> createPlayer(@Valid @RequestBody PlayerRequest req) {
        if (req.pin() == null) {
            throw new IllegalArgumentException("pin is required");
        }
        Player player = adminUseCase.createPlayer(
                new AdminUseCase.CreatePlayerCommand(req.displayName().trim(), req.avatarKey(), req.pin()));
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(player));
    }

    @PutMapping("/players/{id}")
    public ResponseEntity<PlayerResponse> updatePlayer(@PathVariable Long id,
                                                       @Valid @RequestBody PlayerRequest req) {
        Player player = adminUseCase.updatePlayer(
                new AdminUseCase.UpdatePlayerCommand(id, req.displayName().trim(), req.avatarKey()));
        return ResponseEntity.ok(toResponse(player));
    }

    @PostMapping("/players/{id}/pin")
    public ResponseEntity<Void> resetPin(@PathVariable Long id, @Valid @RequestBody PinRequest req) {
        adminUseCase.resetPin(id, req.pin());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/players/{id}")
    public ResponseEntity<Void> deletePlayer(@PathVariable Long id) {
        adminUseCase.deletePlayer(id);
        return ResponseEntity.noContent().build();
    }

    // --- Progress ---
    @GetMapping("/progress")
    public List<PlayerProgress> getProgress() {
        return leaderboardUseCase.getProgress();
    }

    // --- Sessions ---
    @GetMapping("/sessions")
    public List<GameSession> getSessions(@RequestParam(defaultValue = "0") int page,
                                         @RequestParam(defaultValue = "20") int size) {
        return adminUseCase.getAllSessions(page, size);
    }
}
