package dk.wordblitz.domain.port.in;

import dk.wordblitz.domain.model.Category;
import dk.wordblitz.domain.model.GameSession;
import dk.wordblitz.domain.model.Player;
import dk.wordblitz.domain.model.Word;

import java.util.List;

public interface AdminUseCase {

    record CreateCategoryCommand(String nameDa, String nameEn, String color) {}
    record UpdateCategoryCommand(Long id, String nameDa, String nameEn, String color) {}

    record CreateWordCommand(String text, Long categoryId) {}
    record UpdateWordCommand(Long id, String text, Long categoryId) {}

    record CreatePlayerCommand(String displayName, String avatarKey, String pin) {}
    record UpdatePlayerCommand(Long id, String displayName, String avatarKey) {}

    // Categories
    Category createCategory(CreateCategoryCommand command);
    Category updateCategory(UpdateCategoryCommand command);
    void deleteCategory(Long id);

    // Words
    Word createWord(CreateWordCommand command);
    Word updateWord(UpdateWordCommand command);
    void deleteWord(Long id);
    List<Word> getWordsByCategory(Long categoryId);

    // Players
    List<Player> getAllPlayers();
    Player createPlayer(CreatePlayerCommand command);
    Player updatePlayer(UpdatePlayerCommand command);
    void resetPin(Long id, String pin);
    void deletePlayer(Long id);

    // Sessions / scores
    List<GameSession> getAllSessions(int page, int size);
}
