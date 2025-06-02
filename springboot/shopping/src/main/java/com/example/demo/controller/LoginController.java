package com.example.demo.controller;



import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.exception.ShoppingException;
import com.example.demo.model.dto.LoginRequest;
import com.example.demo.model.dto.UserDto;
import com.example.demo.model.entity.User;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.UserService;

import jakarta.servlet.http.HttpSession;



//需要 驗證 loginDTO AuthcodeController 以上成功 做下面
//需要 塞  sessionUser

@RestController
@RequestMapping("/api/login")
public class LoginController {
 

	
	@Autowired
	UserService userService;
	
	@PostMapping		//loginPage 用
	public ResponseEntity<ApiResponse<UserDto>> login(@RequestBody LoginRequest loginDTO,HttpSession session){
		User user= userService.findUserByUserName(loginDTO.getUsername()); //查找使用者 為空不報錯
		//比對
		try {
			if(userService.isLoginValid(loginDTO, user, session)) { 	   //驗證是否登入成功
				UserDto userDto = new UserDto(user.getUsername(),user.getId(),user.getRoleId(),user.getIsActive(),user.getIsEmailVerified());
				session.setAttribute("userDto", userDto);
				user.setLastLoginAt(LocalDateTime.now());//更新 最近登入時間
														 //登入紀錄 還沒建 Entity
				return ResponseEntity.ok(ApiResponse.success("登入成功", userDto));
			}
			return ResponseEntity.badRequest().body(ApiResponse.error("登入失敗"));
		} catch (ShoppingException e) {
			return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
		}catch (Exception e) {
			return ResponseEntity.internalServerError().body(ApiResponse.error("伺服器錯誤"));
		}
	}
	
	
}
