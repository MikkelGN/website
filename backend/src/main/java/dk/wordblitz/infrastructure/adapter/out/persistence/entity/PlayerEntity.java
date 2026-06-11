package dk.wordblitz.infrastructure.adapter.out.persistence.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "players")
public class PlayerEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "display_name", nullable = false, unique = true)
    private String displayName;

    @Column(name = "avatar_key", nullable = false)
    private String avatarKey;

    @Column(name = "pin_hash", nullable = false)
    private String pinHash;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected PlayerEntity() {}

    public PlayerEntity(Long id, String displayName, String avatarKey, String pinHash, Instant createdAt) {
        this.id = id;
        this.displayName = displayName;
        this.avatarKey = avatarKey;
        this.pinHash = pinHash;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getDisplayName() { return displayName; }
    public String getAvatarKey() { return avatarKey; }
    public String getPinHash() { return pinHash; }
    public Instant getCreatedAt() { return createdAt; }
}
