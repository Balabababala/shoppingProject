package com.example.demo.service.front.Impl;



import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.exception.ShoppingException;
import com.example.demo.mapper.*;
import com.example.demo.model.dto.AdminCategoryDto;
import com.example.demo.model.dto.CategoryResponse;
import com.example.demo.model.entity.Category;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.service.front.CategoryService;


@Service
public class CategoryServiceImpl implements CategoryService{
	@Autowired
	private CategoryRepository categoryRepository;
	
	

	//邏輯

	@Override
	public List<CategoryResponse> findTopCategory(){
	    return 	categoryRepository.findAll().stream()
			             .filter(category -> category.getParentId() == null) // parentId是Long，可以直接比對null
			             .map(CategoryMapper::toDto)
			             .toList();
	}
	
	@Override
	public List <CategoryResponse> findLeafCategories() {
		return categoryRepository.findLeafCategories().stream()
													.map(CategoryMapper::toDto)
													.toList();
	}
	
	
//	@Override
//	public CategoryResponse findCategoryBySlug(String slug){
//		Category category = categoryRepository.findBySlug(slug)
//		        .orElseThrow(() -> new RuntimeException("找不到分類 " + slug));
//		return CategoryMapper.toDto(category);
//	}
	
	
	



	@Override
	public List<CategoryResponse> findCategoryChildrenBySlugToCategoryResponse(String slug) {
		return categoryRepository.findChildrenBySlug(slug).stream()
									   .map(categoty->CategoryMapper.toDto(categoty))
									   .toList();
	}
	
	@Override
	public List<Category> findAllCategoryAndDescendantsBySlug(String slug) {
        Optional<Category> rootOpt = categoryRepository.findBySlug(slug);
        if (rootOpt.isEmpty()) {
            return List.of();
        }
        Category root = rootOpt.get();
        List<Category> result = new ArrayList<>();
        result.add(root);
        fetchChildrenRecursively(root, result);
        return result;
    }

    private void fetchChildrenRecursively(Category parent, List<Category> accumulator) {
        List<Category> children = categoryRepository.findByParentId(parent.getId());
        if (children.isEmpty()) return;
        accumulator.addAll(children);
        for (Category child : children) {
            fetchChildrenRecursively(child, accumulator);
        }
    }

    //後台
    
   

    @Override
    public List<AdminCategoryDto> findAll() {
        List<Category> categories = categoryRepository.findAllWithParent();
        return categories.stream()
            .map(AdminCategoryDtoMapper::toDto)
            .toList();
    }

    @Override
    public Optional<AdminCategoryDto> findById(Long id) {
        return categoryRepository.findById(id)
            .map(AdminCategoryDtoMapper::toDto);
    }

    @Override
    public AdminCategoryDto create(AdminCategoryDto dto) {
        Category entity = AdminCategoryDtoMapper.toEntity(dto);

        if (dto.getParentId() != null) {
            categoryRepository.findById(dto.getParentId()).ifPresent(parent -> {
                entity.setParent(parent);
                // 設定層級 = 父分類層級 + 1
                entity.setLevel(parent.getLevel() + 1);
            });
        } else {
            // 頂層分類層級為 0
            entity.setLevel(0);
            entity.setParent(null);
        }

        Category saved = categoryRepository.save(entity);
        return AdminCategoryDtoMapper.toDto(saved);
    }


    @Override
    public AdminCategoryDto update(Long id, AdminCategoryDto dto) {
        return categoryRepository.findById(id).map(entity -> {
            entity.setName(dto.getName());
            entity.setSlug(dto.getSlug());

            if (dto.getParentId() != null) {
                Category parent = categoryRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent category not found: " + dto.getParentId()));
                entity.setParent(parent);
                entity.setParentId(parent.getId());
                entity.setLevel(parent.getLevel() + 1);  // 自動更新層級
            } else {
                entity.setParent(null);
                entity.setParentId(null);
                entity.setLevel(0);  // 頂層分類層級
            }

            Category updated = categoryRepository.save(entity);
            return AdminCategoryDtoMapper.toDto(updated);
        }).orElseThrow(() -> new RuntimeException("Category not found: " + id));
    }

    @Override
    public void deleteById(Long id) {
    	Optional<Category> optional = categoryRepository.findByIdWithChildren(id);
    	 if (optional.isEmpty()) {
             throw new ShoppingException("找不到分類");
         }
    	 
    	if (optional.isPresent()) {
    	    Category category = optional.get();
    	    // 使用 Hibernate.initialize() 強制初始化 products
    	    Hibernate.initialize(category.getProducts());
    	}
    	
        Category category = optional.get();
        if (!category.getChildren().isEmpty() || !category.getProducts().isEmpty()) {
            throw new IllegalStateException("分類底下尚有子分類或商品，無法刪除");
        }
        categoryRepository.deleteById(id);
    }
	
}
