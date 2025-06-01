package com.example.demo.service.Impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.exception.ShoppingException;
import com.example.demo.model.dto.LoginRequest;
import com.example.demo.model.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.PasswordHash;
import com.example.demo.service.UserService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpSession;

@Service
public class UserServiceImpl implements UserService{

	@Autowired
	UserRepository userRepository;
	
	
	@Override
    public User findUserByUserName(String username) {
        return userRepository.findByUsername(username);
    }

	@Override
	public boolean isLoginValid(LoginRequest loginDTO, User user, HttpSession session) throws ShoppingException{
		
			if(!loginDTO.getUsername().equals(user.getUsername())) {
				throw new ShoppingException("找不到使用者");
			}
			
			try {
			//以下有 inputStream 所以用try catch 抓
				if(!PasswordHash.hashPassword(loginDTO.getPassword(),user.getHashSalt()).equals(user.getHashPassword())) {
					throw new ShoppingException("密碼錯誤");
				} 
			} catch (Exception e) {
					throw new ShoppingException("密碼加密失敗：" + e.getMessage());	
			}
			
			if(!loginDTO.getCaptchaCode().equals(session.getAttribute("authCode"))){
				throw new ShoppingException("驗證碼錯誤");
			}
		
		
		return true;
	}

	@Override
	public User findUserById(Long id) {
		return userRepository.findById(id)
	            .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
	}


	
}
