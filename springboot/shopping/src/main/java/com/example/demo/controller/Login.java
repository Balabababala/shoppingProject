package com.example.demo.controller;



import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.dto.LoginDTO;
import com.example.demo.model.entity.User;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.PasswordHash;
import com.example.demo.service.UserService;
import com.example.demo.session.SessionUser;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;



//需要 驗證 loginDTO ApiAuthcode 以上成功 做下面
//需要 塞  sessionUser

@RestController
@RequestMapping("/login")
public class Login {
 
	@Autowired
	UserService userService;
	
	@PostMapping
	public ResponseEntity<ApiResponse<Object>> login(@RequestBody LoginDTO loginDTO,HttpSession session){
		User user= userService.findUserByUserName(loginDTO.getUsername()); //查找使用者 為空不報錯
		//比對
		try {
			if(loginDTO.getUsername().equals(user.getUsername())
				&&	PasswordHash.hashPassword(loginDTO.getPassword(),user.getHashSalt()).equals(user.getHashPassword()) //hashcode 做了 
				&&  loginDTO.getCaptchaCode().equals(session.getAttribute("authCode"))) {
			
				SessionUser sessionUser = new SessionUser(user.getUsername(),user.getRoleId(),user.getIsActive(),user.getIsEmailVerified());
				session.setAttribute("sessionUser", sessionUser);
				user.setLastLoginAt(LocalDateTime.now());//更新 最近登入時間
														 //登入紀錄 還沒建 Entity
														 //邏輯判斷 最好改到service
				return ResponseEntity.ok(new ApiResponse<>("登入成功", null));
			}
		} catch (Exception e) {
			return ResponseEntity.internalServerError().body(new ApiResponse<>("伺服器錯誤", null));
		}
		return ResponseEntity.badRequest().body(new ApiResponse<>("登入失敗", null));
		
	}
	
	
}
