package com.example.demo.repository;

import java.util.Optional;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.entity.Role;
import com.example.demo.model.entity.User;

import io.lettuce.core.dynamic.annotation.Param;

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
	
	@Transactional(readOnly = true)
	@Query("SELECT u FROM User u JOIN FETCH u.role r WHERE u.id = :id")
	Optional<User> findByIdWithRole(@Param("id") Long id);
	
	@Transactional(readOnly = true)
	@Query("SELECT u FROM User u JOIN FETCH u.role r WHERE u.username = :username")
	Optional<User> findByUsernameWithRole(@Param("username") String username);
	
	@Transactional(readOnly = true)
	@Query("SELECT u FROM User u JOIN FETCH u.role r WHERE r = :role")
	List<User> findByRoleWithRole(@Param("role") Role role);
	// 你可以加自訂的方法，像是：
	
}
