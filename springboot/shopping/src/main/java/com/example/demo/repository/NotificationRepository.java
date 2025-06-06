package com.example.demo.repository;

import java.util.List;
import java.util.Optional;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.entity.Notification;



public interface NotificationRepository extends JpaRepository<Notification, Long>{
	//已有方法 find.... save delete find 要用還是要寫 只是不用Query
	
	//0 1 2 ('PENDING', 'READ', 'ARCHIVED')
	@Modifying
	@Transactional
	@Query(value = """
			UPDATE  notifications 
			SET status= 1
			WHERE id=:notificationId
			""",nativeQuery = true)
	void markAsReadByNotificationId(@Param("notificationId") Long notificationId);
	
	@Transactional(readOnly = true)
	@Query(value = """
			SELECT n
			FROM Notification n
			JOIN FETCH n.user
			WHERE n.id= :notificationId
			""")
	Optional<Notification> findByNotificationId(@Param("notificationId") Long notificationId);
	
	@Transactional(readOnly = true)
	List<Notification> findByUserId(Long userId);
	
	
	// 你可以加自訂的方法，像是：
}
