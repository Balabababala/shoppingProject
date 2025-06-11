package com.example.demo.controller;

import com.example.demo.mapper.UserMapper;
import com.example.demo.model.dto.LoginRequest;
import com.example.demo.model.dto.UserDto;
import com.example.demo.model.entity.User;
import com.example.demo.response.ApiResponse;
import com.example.demo.secure.CustomUserDetails;
import com.example.demo.service.LoginLogService;
import com.example.demo.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class LoginController {

    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private LoginLogService loginLogService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserDto>> login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
    	// 先取得 session 裡的驗證碼（authCode）
        HttpSession session = request.getSession();
        String sessionCaptcha = (String) session.getAttribute("authCode");

        // 比對前端傳過來的驗證碼，忽略大小寫
        if (loginRequest.getCaptchaCode() == null || !loginRequest.getCaptchaCode().equalsIgnoreCase(sessionCaptcha)) {
        	
        	Optional<User> opt=userService.findByUsername(loginRequest.getUsername());  //如果有該使用者
        	if(opt.isPresent()) {
        		loginLogService.createLoginLog(opt.get(), request, false); 				//直接記錄登入失敗記錄
        	}
        	session.removeAttribute("authCode");
            return ResponseEntity.badRequest().body(ApiResponse.error("驗證碼錯誤"));
        }

        try {
            // 驗證帳密
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );
            
            
            // 認證成功後，取得 CustomUserDetails
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

            // 轉成 UserDto
            UserDto userDto = userService.handleSuccessfulLogin(userDetails.getUser());

            // 選擇性把 UserDto 放入 session
            session.setAttribute("userDto", userDto);

            loginLogService.createLoginLog(userDetails.getUser(), request, true);//直接記錄登入成功記錄
            return ResponseEntity.ok(ApiResponse.success("登入成功", userDto));
        } catch (AuthenticationException e) {
        	Optional<User> opt=userService.findByUsername(loginRequest.getUsername());  //如果有該使用者
        	if(opt.isPresent()) {
        		loginLogService.createLoginLog(opt.get(), request, false); 				//直接記錄登入失敗記錄
        	}
            return ResponseEntity.badRequest().body(ApiResponse.error("帳號或密碼錯誤"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("伺服器錯誤"));
        }
    }

}
