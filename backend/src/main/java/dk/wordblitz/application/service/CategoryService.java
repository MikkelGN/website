package dk.wordblitz.application.service;

import dk.wordblitz.domain.model.Category;
import dk.wordblitz.domain.port.in.GetCategoriesUseCase;
import dk.wordblitz.domain.port.out.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class CategoryService implements GetCategoriesUseCase {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
}
