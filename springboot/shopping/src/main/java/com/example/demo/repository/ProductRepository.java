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
	Optional<Product> findById(Long id);//對照用 id->name
	
	@Transactional(readOnly = true)
	List<Product> findByCategoryId(Long categoryId);
	
	// 你可以加自訂的方法，像是：
	@Transactional
	@Modifying
	@Query(value ="UPDATE products SET stock = stock - :quantity WHERE id = :id AND stock >= :quantity", nativeQuery = true)
	Long minusByIdIfEnoughStock(@Param("id") Long id, @Param("quantity") Integer quantity);

	
	
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
	@Query(value = "SELECT *, MATCH(name, description) AGAINST (:keyword IN BOOLEAN MODE) AS score "
	        + "FROM products "
	        + "WHERE MATCH(name, description) AGAINST (:keyword IN BOOLEAN MODE) "
	        + "ORDER BY score DESC, updated_at DESC", nativeQuery = true)
	List<Product> findByKeywordFullTextBoolean(String keyword);

}
