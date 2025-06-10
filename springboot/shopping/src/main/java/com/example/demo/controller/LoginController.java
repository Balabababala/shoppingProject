package com.example.demo.controller;

import com.example.demo.mapper.UserMapper;
import com.example.demo.model.dto.LoginRequest;
import com.example.demo.model.dto.UserDto;
import com.example.demo.response.ApiResponse;
import com.example.demo.secure.CustomUserDetails;
import com.example.demo.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
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

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserDto>> login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
    	//直接記錄登入計錄
    	
    	// 先取得 session 裡的驗證碼（authCode）
        HttpSession session = request.getSession();
        String sessionCaptcha = (String) session.getAttribute("authCode");

        // 比對前端傳過來的驗證碼，忽略大小寫
        if (loginRequest.getCaptchaCode() == null || !loginRequest.getCaptchaCode().equalsIgnoreCase(sessionCaptcha)) {
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

            return ResponseEntity.ok(ApiResponse.success("登入成功", userDto));
        } catch (AuthenticationException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("帳號或密碼錯誤"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("伺服器錯誤"));
        }
    }

}
