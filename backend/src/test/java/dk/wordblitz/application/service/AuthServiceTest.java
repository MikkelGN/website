package dk.wordblitz.application.service;

import dk.wordblitz.domain.exception.InvalidPinException;
import dk.wordblitz.domain.exception.PinLockedException;
import dk.wordblitz.domain.model.Player;
import dk.wordblitz.domain.port.out.PlayerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.Instant;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AuthServiceTest {

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private PlayerRepository repository;
    private AuthService service;
    private Player player;

    @BeforeEach
    void setUp() {
        repository = mock(PlayerRepository.class);
        service = new AuthService(repository, encoder);
        player = new Player(1L, "Testbarn", "fox", encoder.encode("1234"), Instant.now());
        when(repository.findById(1L)).thenReturn(Optional.of(player));
    }

    @Test
    void correctPinReturnsPlayer() {
        assertThat(service.login(1L, "1234")).isEqualTo(player);
    }

    @Test
    void wrongPinThrows() {
        assertThatThrownBy(() -> service.login(1L, "0000"))
                .isInstanceOf(InvalidPinException.class);
    }

    @Test
    void unknownPlayerThrows() {
        when(repository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.login(99L, "1234"))
                .isInstanceOf(NoSuchElementException.class);
    }

    @Test
    void locksAfterRepeatedFailures() {
        for (int i = 0; i < 4; i++) {
            assertThatThrownBy(() -> service.login(1L, "0000"))
                    .isInstanceOf(InvalidPinException.class);
        }
        assertThatThrownBy(() -> service.login(1L, "0000"))
                .isInstanceOf(PinLockedException.class);
        // Even the correct PIN is rejected while locked
        assertThatThrownBy(() -> service.login(1L, "1234"))
                .isInstanceOf(PinLockedException.class);
    }

    @Test
    void successResetsFailureCount() {
        for (int i = 0; i < 3; i++) {
            assertThatThrownBy(() -> service.login(1L, "0000"))
                    .isInstanceOf(InvalidPinException.class);
        }
        assertThat(service.login(1L, "1234")).isEqualTo(player);
        // Counter was reset, so failures start over
        assertThatThrownBy(() -> service.login(1L, "0000"))
                .isInstanceOf(InvalidPinException.class);
    }

    @Test
    void listPlayersDelegatesToRepository() {
        when(repository.findAll()).thenReturn(List.of(player));
        assertThat(service.listPlayers()).containsExactly(player);
    }
}
