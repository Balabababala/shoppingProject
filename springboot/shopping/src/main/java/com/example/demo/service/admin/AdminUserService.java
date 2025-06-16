package com.example.demo.service.admin;




import java.util.Optional;

import com.example.demo.exception.ShoppingException;
import com.example.demo.model.dto.LoginRequest;
import com.example.demo.model.dto.UserDto;
import com.example.demo.model.dto.UserProfileDto;
import com.example.demo.model.dto.UserRegisterRequest;
import com.example.demo.model.entity.User;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;


public interface AdminUserService {

	//邏輯
	Optional <User> checkUser(String username);																	//登入驗證使用者名稱用  (之後可能+email findUserByEmail)
	UserDto handleSuccessfulLogin(User user);															 		//如果登入成功 生userDto + 更新 最近登入時間 
}
		