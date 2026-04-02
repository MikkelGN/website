package dk.wordblitz.domain.port.in;

import dk.wordblitz.domain.model.AppUser;

public interface AuthUseCase {
    /**
     * Log in or create a player using only their username (honor-based).
     */
    AppUser loginOrCreate(String username);
}
