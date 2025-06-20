package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.model.entity.Order;
import com.example.demo.model.entity.User;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>{
	//已有方法 find.... save delete find 要用還是要寫 只是不用Query
	Optional <Order> findById(Long id);
	
	@Query(value = "SELECT o FROM Order o "
				+ "JOIN FETCH o.orderItems oi "
				+ "JOIN FETCH o.buyer b "
				+ "JOIN FETCH o.seller s "
				+ "WHERE b.id = :userId")
	List<Order> findByBuyerIdWithOrderItemAndBuyerAndSeller(@Param("userId") Long userId);

	@Query(value = "SELECT o FROM Order o "
				+ "JOIN FETCH o.orderItems oi "
				+ "JOIN FETCH o.buyer b "
				+ "JOIN FETCH o.seller s "
				+ "WHERE s.id = :userId")
	List<Order> findBySellerIdWithOrderItemAndBuyerAndSeller(@Param("userId") Long userId);
	
	@Query("""
		    SELECT o FROM Order o
		    JOIN o.buyer u
		    WHERE (:orderNumber IS NULL OR STR(o.id) LIKE %:orderNumber%)
		      AND (:userName IS NULL OR u.username LIKE %:userName%)
		""")
		List<Order> searchOrdersNoPage(
		    @Param("orderNumber") String orderNumber,
		    @Param("userName") String userName
		);

	@Query("SELECT o FROM Order o JOIN FETCH o.seller s WHERE o.id = :id")
	Optional<Order> findByIdWithItemsAndSeller(@Param("id") Long orderId);


	// 你可以加自訂的方法，像是：

}
