package dk.wordblitz.domain.exception;

public class PinLockedException extends RuntimeException {
    public PinLockedException() {
        super("Too many failed attempts, try again later");
    }
}
