package com.example.demo.service.Impl;

import java.net.http.HttpRequest;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.exception.ShoppingException;
import com.example.demo.mapper.UserMapper;
import com.example.demo.model.dto.LoginRequest;
import com.example.demo.model.dto.UserDto;
import com.example.demo.model.entity.LoginLog;
import com.example.demo.model.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.LoginLogService;
import com.example.demo.service.PasswordHash;
import com.example.demo.service.UserService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@Service
public class UserServiceImpl implements UserService{

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private LoginLogService loginLogService;
	
	//repository

	@Override
	public Optional<User> findById(Long Id) {
		return userRepository.findById(Id);
	}

	@Override
	public User findByUsername(String username) {
		return userRepository.findByUsername(username);
	}
	

	@Override
	public void save(User user) {
		userRepository.save(user);
	}

	//邏輯
	
	@Override
    public User findUserByUserName(String username) {
        return findByUsername(username);
    }

	
	@Override
	public boolean isLoginValid(LoginRequest loginDTO, User user, HttpServletRequest request) throws ShoppingException{
			HttpSession session =request.getSession();
			 
			if(!loginDTO.getUsername().equals(user.getUsername())) {
				loginLogService.createLoginLog(user, request ,false);//登入紀錄 失敗
				throw new ShoppingException("找不到使用者");
			}
			
			try {
			//以下有 inputStream 所以用try catch 抓
				if(!PasswordHash.hashPassword(loginDTO.getPassword(),user.getSalt()).equals(user.getPasswordHash())) {
					loginLogService.createLoginLog(user, request ,false);//登入紀錄 失敗
					throw new ShoppingException("密碼錯誤");
				} 
			} catch (Exception e) {
				loginLogService.createLoginLog(user, request ,false);//登入紀錄 失敗
				throw new ShoppingException("密碼加密失敗：" + e.getMessage());	
			}
			
			if(!loginDTO.getCaptchaCode().equals(session.getAttribute("authCode"))){
				loginLogService.createLoginLog(user, request ,false);//登入紀錄 失敗
				throw new ShoppingException("驗證碼錯誤");
			}
			loginLogService.createLoginLog(user, request ,true);//登入紀錄
		
		return true;
	}

	@Override
	public User findUserById(Long id) {
		return findById(id)
	            .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
	}
	@Override
	public UserDto handleSuccessfulLogin(User user) {
		user.setLastLoginAt(LocalDateTime.now());     //更新 最近登入時間
		save(user);
		UserDto userDto=UserMapper.toDto(user);
		return userDto;
	}
}
