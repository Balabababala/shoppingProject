package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.model.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
	//已有方法 find.... save delete
	
    // 你可以加自訂的方法，像是：
	Optional<Category> findBySlug(String slug);       
	Optional<Category> findById(Long CategoriyId);
	List<Category> findByParentId(Long parentId);

	@Query(value = "SELECT * FROM category c JOIN category p ON c.parent_id = p.id WHERE p.slug = :slug", nativeQuery = true)
	List<Category> findChildrenBySlug(@Param("slug") String slug);//只有兒子 後面給遞迴用的
}

