package dk.wordblitz.infrastructure.adapter.in.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/linkedin")
public class LinkedInController {

    private static final Logger log = LoggerFactory.getLogger(LinkedInController.class);
    private final ChatClient chatClient;

    public LinkedInController(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    record ConvertRequest(String text, String language) {}

    @PostMapping("/convert")
    public ResponseEntity<?> convert(@RequestBody ConvertRequest request) {
        if (request.text() == null || request.text().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Text is required"));
        }

        String language = request.language() != null ? request.language() : "en";
        String languageInstruction = language.equals("da")
            ? "Write the entire post in Danish."
            : "Write the entire post in English.";

        String prompt = """
                Transform the following ordinary situation into an extremely over-the-top LinkedIn post.

                Requirements:
                - Use corporate buzzwords: journey, grateful, humbled, excited to share, game-changer, \
                synergy, leverage, growth mindset, passion, hustle, pivot, disrupt
                - Add plenty of emojis (🚀💡🙏✨🎯💪🌟🔥)
                - End with 5-7 hashtags (#Blessed #Growth #Leadership #Innovation #Mindset #Hustle)
                - Write 3-4 short dramatic paragraphs
                - Be absurdly inspirational and dramatic about the most mundane things
                - %s
                - Output ONLY the LinkedIn post, no introduction or explanation

                Situation: %s

                LinkedIn post:
                """.formatted(languageInstruction, request.text().trim());

        try {
            String post = chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content();
            return ResponseEntity.ok(Map.of("post", post));
        } catch (Exception e) {
            log.error("Ollama call failed: {}", e.getMessage(), e);
            return ResponseEntity.status(503).body(
                Map.of("error", "Ollama not available. Is it running on port 11434?")
            );
        }
    }
}
