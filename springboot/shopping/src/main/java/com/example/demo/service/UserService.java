package com.example.demo.service;


import com.example.demo.exception.ShoppingException;
import com.example.demo.model.dto.LoginDto;
import com.example.demo.model.entity.User;

import jakarta.servlet.http.HttpSession;


public interface UserService {
	User findUserByUserName(String username);
	boolean isLoginValid(LoginDto loginDTO, User user, HttpSession session) throws ShoppingException;//登入驗證 loginDTO 符不符合資料庫     	
}
