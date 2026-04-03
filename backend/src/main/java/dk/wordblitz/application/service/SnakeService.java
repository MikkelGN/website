package dk.wordblitz.application.service;

import dk.wordblitz.domain.model.SnakeLeaderboardEntry;
import dk.wordblitz.domain.model.SnakeScore;
import dk.wordblitz.domain.port.in.SnakeUseCase;
import dk.wordblitz.domain.port.out.SnakeScoreRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@Transactional
public class SnakeService implements SnakeUseCase {

    private final SnakeScoreRepository repository;

    public SnakeService(SnakeScoreRepository repository) {
        this.repository = repository;
    }

    @Override
    public void submitScore(SubmitScoreCommand command) {
        if (command.score() > 0) {
            repository.save(new SnakeScore(null, command.userId(), command.score(), Instant.now()));
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<SnakeLeaderboardEntry> getLeaderboard(int limit) {
        return repository.findTopScores(Math.min(limit, 100));
    }
}
