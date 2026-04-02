package dk.wordblitz.domain.port.out;

import dk.wordblitz.domain.model.AppUser;

import java.util.List;
import java.util.Optional;

public interface UserRepository {
    Optional<AppUser> findByUsername(String username);
    AppUser save(AppUser user);
    List<AppUser> findAll();
}
