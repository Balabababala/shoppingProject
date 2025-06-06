package com.example.demo.service;




import java.util.Optional;

import com.example.demo.exception.ShoppingException;
import com.example.demo.model.dto.LoginRequest;
import com.example.demo.model.dto.UserDto;
import com.example.demo.model.entity.User;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;


public interface UserService {
	//repository
	Optional<User> findById(Long Id);
	User findByUsername(String username);
	void save(User user);
	
	//邏輯
	User findUserByUserName(String username);			//登入驗證使用者名稱用  (之後可能+email findUserByEmail)
	User findUserById(Long id);							//給別人用的 轉換用	(要優化的話可以 試試)
	boolean isLoginValid(LoginRequest loginDTO, User user, HttpServletRequest request) throws ShoppingException;//登入驗證 loginDTO 符不符合資料庫   + 登入紀錄 還沒做完 
	UserDto handleSuccessfulLogin(User user );															 		//如果登入成功 生userDto + 更新 最近登入時間 
	
}
		