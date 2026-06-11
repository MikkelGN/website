package dk.wordblitz.application.service;

import dk.wordblitz.domain.model.TetrisScore;
import dk.wordblitz.domain.port.in.TetrisUseCase;
import dk.wordblitz.domain.port.out.TetrisScoreRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@Transactional
public class TetrisService implements TetrisUseCase {

    private final TetrisScoreRepository repository;

    public TetrisService(TetrisScoreRepository repository) {
        this.repository = repository;
    }

    @Override
    public void submitScore(SubmitScoreCommand command) {
        if (command.score() > 0) {
            repository.save(new TetrisScore(null, command.userId(), command.score(),
                    command.level(), command.lines(), Instant.now()));
        }
    }

}
