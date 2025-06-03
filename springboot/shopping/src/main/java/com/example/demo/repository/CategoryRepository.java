package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
	//已有方法 find.... save delete find 要用還是要寫 只是不用Query
	
	@Transactional(readOnly = true)
	Optional<Category> findBySlug(String slug);   
	
	@Transactional(readOnly = true)
	Optional<Category> findById(Long CategoriyId);
	
	@Transactional(readOnly = true)
	List<Category> findByParentId(Long parentId);
	
    // 你可以加自訂的方法，像是：
	
	@Transactional(readOnly = true)
	@Query(value = "SELECT c.* FROM categories c JOIN categories p ON c.parent_id = p.id WHERE p.slug = :slug", nativeQuery = true)
	List<Category> findChildrenBySlug(@Param("slug") String slug);//只有兒子 後面給遞迴用的
}

