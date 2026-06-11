package dk.wordblitz.application.service;

import dk.wordblitz.domain.model.MathScore;
import dk.wordblitz.domain.port.in.MathUseCase;
import dk.wordblitz.domain.port.out.MathScoreRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Set;

@Service
@Transactional
public class MathService implements MathUseCase {

    private static final Set<String> DIFFICULTIES = Set.of("easy", "medium", "hard");

    private final MathScoreRepository repository;

    public MathService(MathScoreRepository repository) {
        this.repository = repository;
    }

    @Override
    public void submitScore(SubmitScoreCommand command) {
        if (!DIFFICULTIES.contains(command.difficulty())) {
            throw new IllegalArgumentException("Unknown difficulty: " + command.difficulty());
        }
        if (command.score() > 0) {
            repository.save(new MathScore(null, command.userId(), command.score(),
                    command.difficulty(), Instant.now()));
        }
    }

}
