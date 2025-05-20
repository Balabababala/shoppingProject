package com.example.demo.repository;

import org.springframework.stereotype.Repository;

import com.example.demo.model.entity.User;

@Repository
public interface UserRepository {
	User findByUserName(String userName);
}
