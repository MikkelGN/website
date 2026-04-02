package dk.wordblitz.infrastructure.adapter.out.persistence.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "words")
public class WordEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String text;

    @Column(name = "category_id", nullable = false)
    private Long categoryId;

    protected WordEntity() {}

    public WordEntity(Long id, String text, Long categoryId) {
        this.id = id;
        this.text = text;
        this.categoryId = categoryId;
    }

    public Long getId() { return id; }
    public String getText() { return text; }
    public Long getCategoryId() { return categoryId; }
    public void setText(String text) { this.text = text; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
}
