package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.dto.CreateOrderDto;
import com.example.demo.model.dto.EmailVerificationRequest;
import com.example.demo.model.dto.UserDto;
import com.example.demo.model.dto.UserProfileDto;
import com.example.demo.model.dto.UserRegisterRequest;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.OrderService;
import com.example.demo.service.UserService;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/api")
public class UserController {

	@Autowired
	private UserService userService;
	@Autowired
	private OrderService orderService;
	
	@GetMapping("/user/me") //contexts 用
	public ResponseEntity<ApiResponse<UserDto>> getRole(HttpSession session) {
		UserDto UserDto= (UserDto)session.getAttribute("userDto");
		if(UserDto==null) {
			return ResponseEntity.status(401).body(ApiResponse.error("尚未登入"));
		}
			return ResponseEntity.ok(ApiResponse.success("取得使用者資料成功",UserDto));
	}
	
	@GetMapping("/user/default-order-info")
	public ResponseEntity<ApiResponse<CreateOrderDto>> getUserOrderInfo(HttpSession session) {		
		UserDto userDto= (UserDto)session.getAttribute("userDto");
		CreateOrderDto createorderDto= orderService.getUserDefaultToCreateOrderDto(userDto);
		return ResponseEntity.ok(ApiResponse.success("取得使用者資料成功",createorderDto));
	}
	
	@GetMapping("/user/profile")
	public ResponseEntity<ApiResponse<UserProfileDto>> getUserProfile(HttpSession session) {
		UserDto userDto= (UserDto)session.getAttribute("userDto");

		UserProfileDto userProfileDto= userService.getProfileDto(userDto.getUserId());
		
		return ResponseEntity.ok(ApiResponse.success("取得使用者資料成功",userProfileDto));
	}
	
	@PostMapping("/user/profile/update")
	public ResponseEntity<ApiResponse<UserProfileDto>> updateUserProfile(@RequestBody UserProfileDto userProfileDto,HttpSession session) {
		UserDto userDto= (UserDto)session.getAttribute("userDto");
		userService.updateUser(userDto.getUserId(), userProfileDto);
		
		return ResponseEntity.ok(ApiResponse.success("更新使用者資料成功",null));
	}
	
	@PostMapping("/register")
	public ResponseEntity<ApiResponse<Void>> register(@Valid @RequestBody UserRegisterRequest request, BindingResult result) {
	    if (result.hasErrors()) {
	        String errorMsg = result.getAllErrors().get(0).getDefaultMessage();
	        return ResponseEntity.badRequest().body(ApiResponse.error(errorMsg));
	    }
	    try {
	        userService.register(request);
	        return ResponseEntity.ok(ApiResponse.success("成功", null));
	    } catch (Exception e) {
	    	return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
	    }
	}
	
    @PostMapping("/verify-email")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(@RequestBody EmailVerificationRequest req) {
        try {
        	  String email = req.getEmail();
        	  String code = req.getCode();
	          userService.verifyEmail(email, code);
	          return ResponseEntity.ok(ApiResponse.success("驗證成功", null) );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("失敗 "+e.getMessage()));
        }
    }
}
	

