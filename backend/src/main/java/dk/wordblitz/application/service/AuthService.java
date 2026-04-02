package dk.wordblitz.application.service;

import dk.wordblitz.domain.model.AppUser;
import dk.wordblitz.domain.port.in.AuthUseCase;
import dk.wordblitz.domain.port.out.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@Transactional
public class AuthService implements AuthUseCase {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public AppUser loginOrCreate(String username) {
        return userRepository.findByUsername(username)
                .orElseGet(() -> userRepository.save(new AppUser(null, username, Instant.now())));
    }
}
