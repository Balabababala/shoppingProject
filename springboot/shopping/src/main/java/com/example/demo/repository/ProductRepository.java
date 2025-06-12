package com.example.demo.repository;

import java.util.List;
import java.util.Optional;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository <Product, Long>{
	//已有方法 find.... save delete find 要用還是要寫 只是不用Query

	@Transactional(readOnly = true)
	Optional<Product> findById(Long productId);
	
	@Transactional(readOnly = true)
	@Query("SELECT p FROM Product p JOIN FETCH p.category")
	List<Product> findAllWithCategory();
	
	@Transactional(readOnly = true)
	@Query("SELECT DISTINCT p FROM Product p "
			+ "JOIN FETCH p.seller s "
			+ "JOIN FETCH p.category c "
			+ "LEFT JOIN FETCH p.productImages pi "
			+ "WHERE s.id = :sellerId")
	List<Product> findBySellerIdWithSellerAndCategoryAndProductImage(@Param("sellerId") Long sellerId);
	
	@Transactional(readOnly = true)
	@Query("SELECT DISTINCT p FROM Product p "
			+ "JOIN FETCH p.seller s "
			+ "JOIN FETCH p.category c "
			+ "LEFT JOIN FETCH p.productImages pi "
			+ "WHERE s.id = :sellerId "
			+ "AND p.id= :productId ")
	Optional<Product> findBySellerIdAndProductIdWithSellerAndCategoryAndProductImage(@Param("sellerId") Long sellerId,@Param("productId") Long productId);
	
	@Transactional(readOnly = true)
	@Query("""
		    SELECT DISTINCT p FROM Product p
		    JOIN FETCH p.category c
		    LEFT JOIN FETCH p.productImages pi
		    WHERE p.id = :id
		""")
	Optional<Product> findByIdWithCategoryAndProductImage(@Param("id") Long id);
	
	@Query(value ="""
			SELECT DISTINCT p FROM Product p 
			JOIN FETCH p.category 
			LEFT JOIN FETCH p.productImages 
			WHERE p.category.id IN :categoryIds
		""")
	List<Product> findAllByCategoryIdsWithCategoryAndProductImage(@Param("categoryIds") List<Long> categoryIds);
	
	@Transactional(readOnly = true)
	List<Product> findByCategoryId(Long categoryId);
	
	// 你可以加自訂的方法，像是：
	@Transactional
	@Modifying
	@Query(value ="UPDATE products SET stock = stock - :quantity WHERE id = :id AND stock >= :quantity", nativeQuery = true)
	Integer minusByIdIfEnoughStock(@Param("id") Long id, @Param("quantity") Integer quantity);

	
	
//	//MySQL 內建的相似度比較
//	@Query(value = "SELECT *, MATCH(name, description) AGAINST (:keyword IN NATURAL LANGUAGE MODE) AS score "
//            + "FROM products "
//            + "WHERE MATCH(name, description) AGAINST (:keyword IN NATURAL LANGUAGE MODE) "
//            + "ORDER BY score DESC, updated_at DESC "
//            + "LIMIT 10"
//            , nativeQuery = true)
//	
//	List<Product> findByKeywordFullText(String keyword);

	//MySQL 內建的相似度比較 ver2
	@Transactional(readOnly = true)
	@Query(value = "SELECT p.*, MATCH(p.name, p.description) AGAINST (:keyword IN BOOLEAN MODE) AS score " +
	               "FROM products p " +
	               "WHERE MATCH(p.name, p.description) AGAINST (:keyword IN BOOLEAN MODE) " +
	               "ORDER BY score DESC, p.updated_at DESC",
	       nativeQuery = true)
	List<Product> findByKeywordFullTextBoolean(@Param("keyword") String keyword);


}
