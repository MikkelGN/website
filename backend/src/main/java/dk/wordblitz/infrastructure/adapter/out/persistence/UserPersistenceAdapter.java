package dk.wordblitz.infrastructure.adapter.out.persistence;

import dk.wordblitz.domain.model.AppUser;
import dk.wordblitz.domain.port.out.UserRepository;
import dk.wordblitz.infrastructure.adapter.out.persistence.entity.UserEntity;
import dk.wordblitz.infrastructure.adapter.out.persistence.repository.UserJpaRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class UserPersistenceAdapter implements UserRepository {

    private final UserJpaRepository jpa;

    public UserPersistenceAdapter(UserJpaRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public Optional<AppUser> findByUsername(String username) {
        return jpa.findByUsername(username).map(this::toDomain);
    }

    @Override
    public AppUser save(AppUser user) {
        UserEntity entity = new UserEntity(user.id(), user.username(), user.createdAt());
        return toDomain(jpa.save(entity));
    }

    @Override
    public List<AppUser> findAll() {
        return jpa.findAll().stream().map(this::toDomain).toList();
    }

    private AppUser toDomain(UserEntity e) {
        return new AppUser(e.getId(), e.getUsername(), e.getCreatedAt());
    }
}
