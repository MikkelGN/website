package dk.wordblitz.application.service;

import dk.wordblitz.domain.exception.InvalidPinException;
import dk.wordblitz.domain.exception.PinLockedException;
import dk.wordblitz.domain.model.Player;
import dk.wordblitz.domain.port.in.AuthUseCase;
import dk.wordblitz.domain.port.out.PlayerRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Transactional(readOnly = true)
public class AuthService implements AuthUseCase {

    private static final int MAX_FAILURES = 5;
    private static final long FAILURE_WINDOW_SECONDS = 30;

    private final PlayerRepository playerRepository;
    private final PasswordEncoder passwordEncoder;

    private record Failures(int count, Instant last) {}
    private final Map<Long, Failures> failedAttempts = new ConcurrentHashMap<>();

    public AuthService(PlayerRepository playerRepository, PasswordEncoder passwordEncoder) {
        this.playerRepository = playerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<Player> listPlayers() {
        return playerRepository.findAll();
    }

    @Override
    public Player login(Long playerId, String pin) {
        if (isLocked(playerId)) {
            throw new PinLockedException();
        }

        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new NoSuchElementException("Player not found: " + playerId));

        if (!passwordEncoder.matches(pin, player.pinHash())) {
            recordFailure(playerId);
            if (isLocked(playerId)) {
                throw new PinLockedException();
            }
            throw new InvalidPinException();
        }

        failedAttempts.remove(playerId);
        return player;
    }

    private boolean isLocked(Long playerId) {
        Failures f = failedAttempts.get(playerId);
        if (f == null) return false;
        if (f.last().plusSeconds(FAILURE_WINDOW_SECONDS).isBefore(Instant.now())) {
            failedAttempts.remove(playerId);
            return false;
        }
        return f.count() >= MAX_FAILURES;
    }

    private void recordFailure(Long playerId) {
        failedAttempts.merge(playerId, new Failures(1, Instant.now()), (old, ignored) -> {
            boolean expired = old.last().plusSeconds(FAILURE_WINDOW_SECONDS).isBefore(Instant.now());
            return new Failures(expired ? 1 : old.count() + 1, Instant.now());
        });
    }
}
