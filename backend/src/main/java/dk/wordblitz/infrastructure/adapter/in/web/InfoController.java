package dk.wordblitz.infrastructure.adapter.in.web;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/info")
public class InfoController {

    @Value("${project.buildTime:Build time unavailable}")
    private String buildTime;

    record InfoResponse(String buildTime) {}

    @GetMapping
    public ResponseEntity<InfoResponse> getInfo() {
        return ResponseEntity.ok(new InfoResponse(buildTime.isEmpty() ? "Build time unavailable" : buildTime));
    }
}
