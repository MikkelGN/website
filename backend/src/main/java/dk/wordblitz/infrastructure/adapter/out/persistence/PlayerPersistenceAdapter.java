package dk.wordblitz.infrastructure.adapter.out.persistence;

import dk.wordblitz.domain.model.Player;
import dk.wordblitz.domain.port.out.PlayerRepository;
import dk.wordblitz.infrastructure.adapter.out.persistence.entity.PlayerEntity;
import dk.wordblitz.infrastructure.adapter.out.persistence.repository.PlayerJpaRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class PlayerPersistenceAdapter implements PlayerRepository {

    private final PlayerJpaRepository jpa;

    public PlayerPersistenceAdapter(PlayerJpaRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public Optional<Player> findById(Long id) {
        return jpa.findById(id).map(this::toDomain);
    }

    @Override
    public List<Player> findAll() {
        return jpa.findAll().stream().map(this::toDomain).toList();
    }

    @Override
    public Player save(Player player) {
        PlayerEntity entity = new PlayerEntity(
                player.id(), player.displayName(), player.avatarKey(), player.pinHash(), player.createdAt());
        return toDomain(jpa.save(entity));
    }

    @Override
    public void deleteById(Long id) {
        jpa.deleteById(id);
    }

    private Player toDomain(PlayerEntity e) {
        return new Player(e.getId(), e.getDisplayName(), e.getAvatarKey(), e.getPinHash(), e.getCreatedAt());
    }
}
