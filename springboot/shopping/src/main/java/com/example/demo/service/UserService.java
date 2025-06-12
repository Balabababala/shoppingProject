package com.example.demo.service;




import java.util.Optional;

import com.example.demo.exception.ShoppingException;
import com.example.demo.model.dto.LoginRequest;
import com.example.demo.model.dto.UserDto;
import com.example.demo.model.dto.UserProfileDto;
import com.example.demo.model.dto.UserRegisterRequest;
import com.example.demo.model.entity.User;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;


public interface UserService {

	//邏輯
	void updateUser(Long userId,UserProfileDto userProfileDto);													//更新使用者profile
	void register(UserRegisterRequest userRegisterRequest) throws Exception;									//註冊
	void verifyEmail(String email, String code);																//信箱驗證
	Optional <User> checkUser(String username);																	//登入驗證使用者名稱用  (之後可能+email findUserByEmail)
	User findUserById(Long id);																					//給別人用的 轉換用	(要優化的話可以 試試)
	UserDto handleSuccessfulLogin(User user);															 		//如果登入成功 生userDto + 更新 最近登入時間 
	UserProfileDto getProfileDto(Long id); 																		//取Profile
	
	
}
		