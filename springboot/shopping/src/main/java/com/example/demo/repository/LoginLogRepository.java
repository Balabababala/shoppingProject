package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.entity.LoginLog;

@Repository
public interface LoginLogRepository extends JpaRepository <LoginLog, Long> {
	//已有方法 find.... save delete find 要用還是要寫 只是不用Query
	
	// 你可以加自訂的方法，像是：
}
