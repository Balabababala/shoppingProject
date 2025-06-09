package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.entity.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long>{
	//已有方法 find.... save delete find 要用還是要寫 只是不用Query
	Optional<Role> findById(Integer id);
	// 你可以加自訂的方法，像是：
}
