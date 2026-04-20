package dk.wordblitz.infrastructure.adapter.in.web;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/info")
public class InfoController {

    @Value("${project.version:unknown}")
    private String projectVersion;

    @Value("${spring.ai.ollama.chat.options.model}")
    private String llmModel;

    record InfoResponse(String version, String llmModel) {}

    @GetMapping
    public ResponseEntity<InfoResponse> getInfo() {
        return ResponseEntity.ok(new InfoResponse(projectVersion, llmModel));
    }
}
