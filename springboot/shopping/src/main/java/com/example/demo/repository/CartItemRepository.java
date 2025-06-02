package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.entity.CartItem;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long>{
	//已有方法 find.... save delete  find 要用還是要寫 只是不用Query
	
	//清空購物車用
	@Modifying
	@Transactional
	void deleteByUserId(Long userId);
	
	List<CartItem> findByUserId(Long userId);
	
	//判斷購物車是否已有商品
	List<CartItem> findByUserIdAndProductId(Long userId,Long productId );
	
	// 你可以加自訂的方法，像是：
	
	//防n+1用的
	@Transactional(readOnly = true) 
	@Query(value = "SELECT c.* FROM cart_items c JOIN products p ON c.product_id = p.id WHERE c.user_id = :userId", nativeQuery = true)
	List<CartItem> findByUserIdWithProduct(@Param("userId") Long userId);
	
	
	//加入購物車
	@Modifying
	@Transactional
	@Query(value="INSERT INTO cart_items(user_id,product_id,quantity,added_at) "
			   + 				 "VALUES(:userId,:productId,:quantity,curdate())",nativeQuery = true)		
	void addCartItem(@Param("userId") Long userId,@Param("productId") Long productId ,@Param("quantity") Integer quantity);
	
	//加入購物車 如果已存在用這
	@Modifying
	@Transactional
	@Query(value="UPDATE cart_items SET quantity= quantity + :quantity,updated_at=curdate() where user_id=:userId and product_id=:productId",nativeQuery = true)
	void addCartItemIfExist(@Param("userId") Long userId,@Param("productId") Long productId ,@Param("quantity") Integer quantity);
	
}
