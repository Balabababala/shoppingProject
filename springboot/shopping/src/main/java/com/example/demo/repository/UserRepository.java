package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.entity.User;
import java.util.List;


@Repository
public interface UserRepository extends JpaRepository<User, Long>{
	//已有方法 find.... save delete find 要用還是要寫 只是不用Query
	
	@Transactional(readOnly = true)
	Optional<User> findById(Long Id);
	
	@Transactional(readOnly = true)
	Optional<User> findByUsername(String username);
	
	@Transactional(readOnly = true)
	Optional<User> findByEmail(String email);
	
	// 你可以加自訂的方法，像是：
	
}
