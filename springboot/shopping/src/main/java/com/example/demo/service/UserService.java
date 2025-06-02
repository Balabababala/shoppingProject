package com.example.demo.service;


import java.util.Optional;

import com.example.demo.exception.ShoppingException;
import com.example.demo.model.dto.LoginRequest;
import com.example.demo.model.entity.User;

import jakarta.servlet.http.HttpSession;


public interface UserService {
	//repository
	Optional<User> findById(Long Id);
	User findByUsername(String username);
	
	//邏輯
	User findUserByUserName(String username);
	User findUserById(Long id);
	boolean isLoginValid(LoginRequest loginDTO, User user, HttpSession session) throws ShoppingException;//登入驗證 loginDTO 符不符合資料庫     	
}
