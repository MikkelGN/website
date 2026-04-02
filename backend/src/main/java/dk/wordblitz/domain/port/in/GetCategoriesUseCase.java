package dk.wordblitz.domain.port.in;

import dk.wordblitz.domain.model.Category;

import java.util.List;

public interface GetCategoriesUseCase {
    List<Category> getAllCategories();
}
