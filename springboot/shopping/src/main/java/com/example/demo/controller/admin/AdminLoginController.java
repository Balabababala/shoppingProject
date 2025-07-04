package com.example.demo.controller.admin;

import com.example.demo.model.dto.LoginRequest;
import com.example.demo.model.dto.UserDto;
import com.example.demo.model.entity.User;
import com.example.demo.response.ApiResponse;
import com.example.demo.secure.CustomUserDetails;
import com.example.demo.secure.JwtService;
import com.example.demo.service.admin.AdminLoginLogService;
import com.example.demo.service.admin.AdminUserService;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminLoginController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private AdminUserService adminUserService;

    @Autowired
    private AdminLoginLogService adminLoginLogService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<String>> login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        // 1. 從前端接收驗證碼輸入與驗證碼 JWT token
        String userInputCaptcha = loginRequest.getCaptchaCode();
        String captchaToken = loginRequest.getCaptchaToken();

        // 2. 用 jwtService 解碼 captchaToken 拿原始驗證碼文字
        String originalCaptcha;
        try {
            originalCaptcha = jwtService.parseCaptchaJwtToken(captchaToken);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("驗證碼無效或過期"));
        }

        // 3. 比對使用者輸入的驗證碼 (忽略大小寫)
        if (originalCaptcha == null || !originalCaptcha.equalsIgnoreCase(userInputCaptcha)) {
            Optional<User> opt = adminUserService.checkUser(loginRequest.getUsername());
            opt.ifPresent(user -> adminLoginLogService.createLoginLog(user, request, false));
            return ResponseEntity.badRequest().body(ApiResponse.error("驗證碼錯誤"));
        }

        // 4. 驗證帳密
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            UserDto adminUserDto = adminUserService.handleSuccessfulLogin(userDetails.getUser());

            String token = jwtService.generateJwtToken(adminUserDto);

            // 記錄登入成功
            adminLoginLogService.createLoginLog(userDetails.getUser(), request, true);

            return ResponseEntity.ok(ApiResponse.success("登入成功", token));
        } catch (AuthenticationException e) {
            Optional<User> opt = adminUserService.checkUser(loginRequest.getUsername());
            opt.ifPresent(user -> adminLoginLogService.createLoginLog(user, request, false));
            return ResponseEntity.badRequest().body(ApiResponse.error("帳號或密碼錯誤"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("伺服器錯誤"));
        }
    }
}
