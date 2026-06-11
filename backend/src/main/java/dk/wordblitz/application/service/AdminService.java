package dk.wordblitz.application.service;

import dk.wordblitz.domain.model.Category;
import dk.wordblitz.domain.model.GameSession;
import dk.wordblitz.domain.model.Player;
import dk.wordblitz.domain.model.Word;
import dk.wordblitz.domain.port.in.AdminUseCase;
import dk.wordblitz.domain.port.out.CategoryRepository;
import dk.wordblitz.domain.port.out.GameSessionRepository;
import dk.wordblitz.domain.port.out.PlayerRepository;
import dk.wordblitz.domain.port.out.WordRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional
public class AdminService implements AdminUseCase {

    private final CategoryRepository categoryRepository;
    private final WordRepository wordRepository;
    private final PlayerRepository playerRepository;
    private final GameSessionRepository sessionRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminService(CategoryRepository categoryRepository, WordRepository wordRepository,
                        PlayerRepository playerRepository, GameSessionRepository sessionRepository,
                        PasswordEncoder passwordEncoder) {
        this.categoryRepository = categoryRepository;
        this.wordRepository = wordRepository;
        this.playerRepository = playerRepository;
        this.sessionRepository = sessionRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Category createCategory(CreateCategoryCommand command) {
        return categoryRepository.save(new Category(null, command.nameDa(), command.nameEn(), command.color()));
    }

    @Override
    public Category updateCategory(UpdateCategoryCommand command) {
        categoryRepository.findById(command.id())
                .orElseThrow(() -> new NoSuchElementException("Category not found: " + command.id()));
        return categoryRepository.save(new Category(command.id(), command.nameDa(), command.nameEn(), command.color()));
    }

    @Override
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }

    @Override
    public Word createWord(CreateWordCommand command) {
        return wordRepository.save(new Word(null, command.text(), command.categoryId()));
    }

    @Override
    public Word updateWord(UpdateWordCommand command) {
        wordRepository.findById(command.id())
                .orElseThrow(() -> new NoSuchElementException("Word not found: " + command.id()));
        return wordRepository.save(new Word(command.id(), command.text(), command.categoryId()));
    }

    @Override
    public void deleteWord(Long id) {
        wordRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Word> getWordsByCategory(Long categoryId) {
        return wordRepository.findByCategoryId(categoryId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    @Override
    public Player createPlayer(CreatePlayerCommand command) {
        return playerRepository.save(new Player(
                null, command.displayName(), command.avatarKey(),
                passwordEncoder.encode(command.pin()), Instant.now()));
    }

    @Override
    public Player updatePlayer(UpdatePlayerCommand command) {
        Player existing = playerRepository.findById(command.id())
                .orElseThrow(() -> new NoSuchElementException("Player not found: " + command.id()));
        return playerRepository.save(new Player(
                existing.id(), command.displayName(), command.avatarKey(),
                existing.pinHash(), existing.createdAt()));
    }

    @Override
    public void resetPin(Long id, String pin) {
        Player existing = playerRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Player not found: " + id));
        playerRepository.save(new Player(
                existing.id(), existing.displayName(), existing.avatarKey(),
                passwordEncoder.encode(pin), existing.createdAt()));
    }

    @Override
    public void deletePlayer(Long id) {
        playerRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<GameSession> getAllSessions(int page, int size) {
        return sessionRepository.findAllPaged(page, size);
    }
}
