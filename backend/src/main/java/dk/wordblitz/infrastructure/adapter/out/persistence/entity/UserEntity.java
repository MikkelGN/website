package dk.wordblitz.infrastructure.adapter.out.persistence.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "app_users")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected UserEntity() {}

    public UserEntity(Long id, String username, Instant createdAt) {
        this.id = id;
        this.username = username;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public Instant getCreatedAt() { return createdAt; }
}
