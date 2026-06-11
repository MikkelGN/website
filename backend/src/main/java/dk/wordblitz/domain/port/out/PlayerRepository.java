package dk.wordblitz.domain.port.out;

import dk.wordblitz.domain.model.Player;

import java.util.List;
import java.util.Optional;

public interface PlayerRepository {
    Optional<Player> findById(Long id);
    List<Player> findAll();
    Player save(Player player);
    void deleteById(Long id);
}
