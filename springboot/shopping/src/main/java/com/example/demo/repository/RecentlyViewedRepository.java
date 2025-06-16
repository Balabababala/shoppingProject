package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.model.entity.RecentlyViewed;

public interface RecentlyViewedRepository extends JpaRepository<RecentlyViewed, Long>{
	//已有方法 find.... save delete find 要用還是要寫 只是不用Query
	Optional<RecentlyViewed> findByUserIdAndProductId(Long UserId,Long productId);
	
	
	
	// 你可以加自訂的方法，像是：
	@Query(value = "SELECT rv "
				+ "FROM RecentlyViewed rv "
				+ "JOIN FETCH rv.user u "
				+ "JOIN FETCH rv.product p "
				+ "LEFT JOIN FETCH p.productImages pi "
				+ "WHERE rv.user.id = :userId "
				+ "ORDER BY rv.viewedAt DESC")
	List <RecentlyViewed> findByUserIdOrderByViewTimeDescWithUserAndproductAndproductImage(@Param("userId") Long userId);
}
