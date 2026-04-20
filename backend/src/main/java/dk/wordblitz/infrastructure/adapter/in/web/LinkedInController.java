package dk.wordblitz.infrastructure.adapter.in.web;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/linkedin")
public class LinkedInController {

    private final ChatClient chatClient;

    public LinkedInController(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    record ConvertRequest(String text) {}

    @PostMapping("/convert")
    public ResponseEntity<?> convert(@RequestBody ConvertRequest request) {
        if (request.text() == null || request.text().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Text is required"));
        }

        String prompt = """
                Transform the following ordinary situation into an extremely over-the-top LinkedIn post.

                Requirements:
                - Use corporate buzzwords: journey, grateful, humbled, excited to share, game-changer, \
                synergy, leverage, growth mindset, passion, hustle, pivot, disrupt
                - Add plenty of emojis (🚀💡🙏✨🎯💪🌟🔥)
                - End with 5-7 hashtags (#Blessed #Growth #Leadership #Innovation #Mindset #Hustle)
                - Write 3-4 short dramatic paragraphs
                - Be absurdly inspirational and dramatic about the most mundane things
                - If the input is in Danish, write the entire post in Danish
                - If the input is in English, write the entire post in English
                - Output ONLY the LinkedIn post, no introduction or explanation

                Situation: %s

                LinkedIn post:
                """.formatted(request.text().trim());

        try {
            String post = chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content();
            return ResponseEntity.ok(Map.of("post", post));
        } catch (Exception e) {
            return ResponseEntity.status(503).body(
                Map.of("error", "Ollama not available. Is it running on port 11434?")
            );
        }
    }
}
