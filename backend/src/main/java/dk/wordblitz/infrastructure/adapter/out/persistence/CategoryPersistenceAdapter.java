package dk.wordblitz.infrastructure.adapter.out.persistence;

import dk.wordblitz.domain.model.Category;
import dk.wordblitz.domain.port.out.CategoryRepository;
import dk.wordblitz.infrastructure.adapter.out.persistence.entity.CategoryEntity;
import dk.wordblitz.infrastructure.adapter.out.persistence.repository.CategoryJpaRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class CategoryPersistenceAdapter implements CategoryRepository {

    private final CategoryJpaRepository jpa;

    public CategoryPersistenceAdapter(CategoryJpaRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public List<Category> findAll() {
        return jpa.findAll().stream().map(this::toDomain).toList();
    }

    @Override
    public Optional<Category> findById(Long id) {
        return jpa.findById(id).map(this::toDomain);
    }

    @Override
    public Category save(Category category) {
        CategoryEntity entity = new CategoryEntity(
                category.id(), category.nameDa(), category.nameEn(), category.color()
        );
        return toDomain(jpa.save(entity));
    }

    @Override
    public void deleteById(Long id) {
        jpa.deleteById(id);
    }

    private Category toDomain(CategoryEntity e) {
        return new Category(e.getId(), e.getNameDa(), e.getNameEn(), e.getColor());
    }
}
