package dk.wordblitz.domain.port.in;

import dk.wordblitz.domain.model.Player;

import java.util.List;

public interface AuthUseCase {

    /**
     * Players available in the profile picker (callers must not expose pinHash).
     */
    List<Player> listPlayers();

    /**
     * Log in a player by verifying their 4-digit PIN.
     *
     * @throws dk.wordblitz.domain.exception.InvalidPinException if the PIN is wrong
     * @throws dk.wordblitz.domain.exception.PinLockedException  if too many recent failures
     * @throws java.util.NoSuchElementException                  if the player does not exist
     */
    Player login(Long playerId, String pin);
}
