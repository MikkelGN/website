package dk.wordblitz.infrastructure.adapter.in.web;

import dk.wordblitz.domain.model.AppUser;
import dk.wordblitz.domain.model.Category;
import dk.wordblitz.domain.model.GameSession;
import dk.wordblitz.domain.model.Word;
import dk.wordblitz.domain.port.in.AdminUseCase;
import dk.wordblitz.domain.port.in.GetCategoriesUseCase;
import dk.wordblitz.infrastructure.security.JwtService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
    private final JwtService jwtService;
    private final String adminUsername;
    private final String adminPassword;

    public AdminController(AdminUseCase adminUseCase, GetCategoriesUseCase getCategoriesUseCase,
                           JwtService jwtService,
                           @Value("${app.admin.username}") String adminUsername,
                           @Value("${app.admin.password}") String adminPassword) {
        this.adminUseCase = adminUseCase;
        this.getCategoriesUseCase = getCategoriesUseCase;
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

    // --- Users ---
    @GetMapping("/users")
    public List<AppUser> getUsers() {
        return adminUseCase.getAllUsers();
    }

    // --- Sessions ---
    @GetMapping("/sessions")
    public List<GameSession> getSessions(@RequestParam(defaultValue = "0") int page,
                                         @RequestParam(defaultValue = "20") int size) {
        return adminUseCase.getAllSessions(page, size);
    }
}
