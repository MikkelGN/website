package dk.wordblitz.infrastructure.adapter.out.persistence.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "vocabulary_word")
public class VocabularyWordEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String russian;

    @Column(nullable = false)
    private String danish;

    @Column(nullable = false, length = 50)
    private String category;

    public Long getId() { return id; }
    public String getRussian() { return russian; }
    public String getDanish() { return danish; }
    public String getCategory() { return category; }
}
