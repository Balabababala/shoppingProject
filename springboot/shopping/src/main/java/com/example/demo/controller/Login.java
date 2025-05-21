package com.example.demo.controller;



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
	public ResponseEntity<ApiResponse<Object>> login(@RequestBody LoginDTO loginDTO,HttpServletRequest req){
		User user= userService.findUserByUserName(loginDTO.getUserName()); //查找使用者 為空不報錯
		HttpSession session= req.getSession();
		//比對
		try {
			if(loginDTO.getUserName().equals(user.getUserName())
				&&	PasswordHash.hashPassword(loginDTO.getPassword(),user.getHashSalt()).equals(user.getHashPassword()) //hashcode 做了 
				&&  loginDTO.getCaptchaCode().equals(session.getAttribute("authCode"))) {
			
				SessionUser sessionUser = new SessionUser(user.getUserName(),user.getRoleId(),user.getIsActive(),user.getIsEmailVerified());
				session.setAttribute("sessionUser", sessionUser);
				return ResponseEntity.ok(new ApiResponse<>("登入成功", null));
			}
		} catch (Exception e) {
			return ResponseEntity.internalServerError().body(new ApiResponse<>("伺服器錯誤", null));
		}
		return ResponseEntity.badRequest().body(new ApiResponse<>("登入失敗", null));
		
	}
	
	
}
