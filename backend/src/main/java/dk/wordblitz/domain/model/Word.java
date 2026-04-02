package dk.wordblitz.domain.model;

public record Word(
        Long id,
        String text,
        Long categoryId
) {}
