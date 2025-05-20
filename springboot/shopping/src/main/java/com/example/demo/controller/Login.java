package com.example.demo.controller;

import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.dto.LoginDTO;
import com.example.demo.model.entity.User;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.websocket.Session;


//需要 驗證 loginDTO ApiAuthcode 以上成功 做下面
//需要 塞session loginInfo

@RestController
@RequestMapping("/login")
public class Login {
 
	@Autowired
	UserService userService;
	
	
	@PostMapping
	public ResponseEntity<ApiResponse<Object>> login(@RequestBody LoginDTO loginDTO,HttpServletRequest req){
		User user= userService.findUserByUserName(loginDTO.getUsername()); //查找使用者 為空不報錯
		HttpSession session= req.getSession();
		//比對
		if(loginDTO.getUsername().equals(user.getUserName())
			&&	loginDTO.getPassword().equals(user.getHashPassword())
			&&  loginDTO.getCaptchaCode().equals(session.getAttribute("authCode"))) {
		//塞session loginInfo 還沒建
			return ResponseEntity.ok(new ApiResponse<>("登入成功", null));
		}
		return ResponseEntity.badRequest().body(new ApiResponse<>("登入失敗", null));
		
	}
	
	
}
