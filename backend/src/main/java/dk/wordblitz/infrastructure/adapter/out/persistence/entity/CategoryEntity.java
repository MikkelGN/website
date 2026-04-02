package dk.wordblitz.infrastructure.adapter.out.persistence.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "categories")
public class CategoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name_da", nullable = false)
    private String nameDa;

    @Column(name = "name_en", nullable = false)
    private String nameEn;

    @Column(nullable = false)
    private String color;

    protected CategoryEntity() {}

    public CategoryEntity(Long id, String nameDa, String nameEn, String color) {
        this.id = id;
        this.nameDa = nameDa;
        this.nameEn = nameEn;
        this.color = color;
    }

    public Long getId() { return id; }
    public String getNameDa() { return nameDa; }
    public String getNameEn() { return nameEn; }
    public String getColor() { return color; }
    public void setNameDa(String nameDa) { this.nameDa = nameDa; }
    public void setNameEn(String nameEn) { this.nameEn = nameEn; }
    public void setColor(String color) { this.color = color; }
}
