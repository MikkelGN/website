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

    record ConvertRequest(String text, String language, boolean includeHashtags, String length, int intensity) {}

    @PostMapping("/convert")
    public ResponseEntity<?> convert(@RequestBody ConvertRequest request) {
        if (request.text() == null || request.text().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Text is required"));
        }

        String language = request.language() != null ? request.language() : "en";

        String prompt = language.equals("da") ? buildDanishPrompt(request) : buildEnglishPrompt(request);

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

    private String buildDanishPrompt(ConvertRequest request) {
        String lengthInstruction = switch (request.length() != null ? request.length() : "medium") {
            case "short" -> "Skriv 1-2 korte afsnit";
            case "long" -> "Skriv præcis 5 afsnit";
            default -> "Skriv 3-4 afsnit";
        };

        String intensityLevel = switch (request.intensity()) {
            case 1 -> "Skriv i en meget normal tone med kun et lille hint af corporate sproget.";
            case 2 -> "Brug milde corporate buzzwords engang imellem.";
            case 4 -> "Læg på LinkedIn-sproget tungt — hver sætning skal pible af buzzwords og inspiration.";
            case 5 -> "Gå helt max LinkedIn: hvert ord skal være en buzzword, hver sætning en åbenbaring, rent vanvittig corporate inspiration.";
            default -> "Brug corporate buzzwords hyppigt med klar LinkedIn dramatisk flair.";
        };

        String hashtagsLine = request.includeHashtags
            ? "- Afslut med 5-7 hashtags (#Velsignet #Vækst #Lederskap #Innovation #Mindset #Hustl)"
            : "";

        return """
                Skriv opslaget på dansk. Omdann den følgende ordinære situation til et ekstremt overdrevet LinkedIn-opslag.

                Krav:
                - %s
                - Tilføj masser af emojis (🚀💡🙏✨🎯💪🌟🔥)
                %s
                - Vær vanvittig inspirerende og dramatisk omkring det mest banale
                - %s
                - Output KUN opslaget, ingen introduktion eller forklaring

                Situation: %s

                LinkedIn-opslag:
                """.formatted(intensityLevel, hashtagsLine, lengthInstruction, request.text().trim());
    }

    private String buildEnglishPrompt(ConvertRequest request) {
        String lengthInstruction = switch (request.length() != null ? request.length() : "medium") {
            case "short" -> "Write 1-2 short paragraphs";
            case "long" -> "Write exactly 5 paragraphs";
            default -> "Write 3-4 paragraphs";
        };

        String intensityLevel = switch (request.intensity()) {
            case 1 -> "Write in a mostly normal tone with just a hint of corporate language.";
            case 2 -> "Use mild corporate buzzwords occasionally.";
            case 4 -> "Lay on the LinkedIn-speak heavily — every sentence should drip with buzzwords and inspiration.";
            case 5 -> "Go absolutely maximum LinkedIn: every word must be a buzzword, every sentence a revelation, pure unhinged corporate inspiration.";
            default -> "Use corporate buzzwords frequently with clear LinkedIn dramatic flair.";
        };

        String hashtagsLine = request.includeHashtags
            ? "- End with 5-7 hashtags (#Blessed #Growth #Leadership #Innovation #Mindset #Hustle)"
            : "";

        return """
                Write the post entirely in English. Transform the following ordinary situation into an extremely over-the-top LinkedIn post.

                Requirements:
                - %s
                - Add plenty of emojis (🚀💡🙏✨🎯💪🌟🔥)
                %s
                - Be absurdly inspirational and dramatic about the most mundane things
                - %s
                - Output ONLY the LinkedIn post, no introduction or explanation

                Situation: %s

                LinkedIn post:
                """.formatted(intensityLevel, hashtagsLine, lengthInstruction, request.text().trim());
    }
}
