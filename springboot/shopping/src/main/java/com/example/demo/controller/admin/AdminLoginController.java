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
import jakarta.servlet.http.HttpSession;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

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
        HttpSession session = request.getSession();
        String sessionCaptcha = (String) session.getAttribute("authCode");

        // 驗證驗證碼
        if (loginRequest.getCaptchaCode() == null || !loginRequest.getCaptchaCode().equalsIgnoreCase(sessionCaptcha)) {
            Optional<User> opt = adminUserService.checkUser(loginRequest.getUsername());
            opt.ifPresent(user -> adminLoginLogService.createLoginLog(user, request, false));

            session.removeAttribute("authCode");
            return ResponseEntity.badRequest().body(ApiResponse.error("驗證碼錯誤"));
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            UserDto adminUserDto = adminUserService.handleSuccessfulLogin(userDetails.getUser());

            // 產生 JWT token 並回傳
            String token = jwtService.generateJwtToken(adminUserDto);

            // 記錄成功登入
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
