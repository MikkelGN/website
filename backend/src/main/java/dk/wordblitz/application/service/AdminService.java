package dk.wordblitz.application.service;

import dk.wordblitz.domain.model.AppUser;
import dk.wordblitz.domain.model.Category;
import dk.wordblitz.domain.model.GameSession;
import dk.wordblitz.domain.model.Word;
import dk.wordblitz.domain.port.in.AdminUseCase;
import dk.wordblitz.domain.port.out.CategoryRepository;
import dk.wordblitz.domain.port.out.GameSessionRepository;
import dk.wordblitz.domain.port.out.UserRepository;
import dk.wordblitz.domain.port.out.WordRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional
public class AdminService implements AdminUseCase {

    private final CategoryRepository categoryRepository;
    private final WordRepository wordRepository;
    private final UserRepository userRepository;
    private final GameSessionRepository sessionRepository;

    public AdminService(CategoryRepository categoryRepository, WordRepository wordRepository,
                        UserRepository userRepository, GameSessionRepository sessionRepository) {
        this.categoryRepository = categoryRepository;
        this.wordRepository = wordRepository;
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
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
    public List<AppUser> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<GameSession> getAllSessions(int page, int size) {
        return sessionRepository.findAllPaged(page, size);
    }
}
