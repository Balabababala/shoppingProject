package com.example.demo.repository;

import java.util.List;
import java.util.Optional;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.entity.Favorite;



@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long>{
	//已有方法 find.... save delete find 要用還是要寫 只是不用Query
	@Modifying
	@Transactional
	Favorite save(Favorite favorite);

	
	@Modifying
	@Transactional
	void delete(Favorite favorite);
	
	List<Favorite> findByUserId(Long userId);
	
	@Transactional(readOnly = true)
	@Query("""
			    SELECT DISTINCT f FROM Favorite f
			    JOIN FETCH f.user u
			    JOIN FETCH f.product p
			    LEFT JOIN FETCH p.productImages pi
			    WHERE f.user.id = :userId
		   """)
	List<Favorite> findByUserIdWithUserAndProductAndImages(@Param("userId") Long userId);
	
	
	Optional<Favorite> findByUserIdAndProductId(Long userId ,Long productId);
}
