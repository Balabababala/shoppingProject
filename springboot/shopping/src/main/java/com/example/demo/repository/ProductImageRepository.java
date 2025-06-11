package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.entity.ProductImage;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Long>{
	
	//已有方法 find.... save delete  find 要用還是要寫 只是不用Query
	
	void deleteByIdAndProductId(Long id, Long productId);
	
	@Transactional(readOnly = true)
	@Query("SELECT pi "
			+ "FROM ProductImage pi "
			+ "JOIN FETCH pi.product p "
			+ "WHERE p.id = :productId "
			+ "ORDER BY pi.number ASC")
	List<ProductImage> findByProductIdOrderByNumberAscWithProduct(@Param("productId") Long productId);

	@Transactional(readOnly = true)
	@Query("SELECT pi "
			+ "FROM ProductImage pi "
			+ "JOIN FETCH pi.product p "
			+ "WHERE pi.id = :id "
			+ "AND p.id = :productId")
	Optional<ProductImage> findByIdAndProductIdWithProduct(@Param("id") Long id, @Param("productId") Long productId);
	
	
	// 你可以加自訂的方法，像是：
}
