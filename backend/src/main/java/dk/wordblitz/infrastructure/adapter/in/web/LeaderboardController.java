package dk.wordblitz.infrastructure.adapter.in.web;

import dk.wordblitz.domain.model.UnifiedLeaderboardEntry;
import dk.wordblitz.domain.port.in.LeaderboardUseCase;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final LeaderboardUseCase leaderboardUseCase;

    public LeaderboardController(LeaderboardUseCase leaderboardUseCase) {
        this.leaderboardUseCase = leaderboardUseCase;
    }

    @GetMapping("/{gameType}")
    public List<UnifiedLeaderboardEntry> getLeaderboard(@PathVariable String gameType,
                                                        @RequestParam(defaultValue = "20") int limit) {
        return leaderboardUseCase.getLeaderboard(gameType, limit);
    }
}
