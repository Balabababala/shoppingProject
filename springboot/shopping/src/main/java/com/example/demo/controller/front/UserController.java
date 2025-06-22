package com.example.demo.controller.front;

import com.example.demo.exception.ShoppingException;
import com.example.demo.model.dto.CreateOrderDto;
import com.example.demo.model.dto.EmailVerificationRequest;
import com.example.demo.model.dto.UserDto;
import com.example.demo.model.dto.UserProfileDto;
import com.example.demo.model.dto.UserRegisterRequest;
import com.example.demo.response.ApiResponse;
import com.example.demo.secure.CustomUserDetails;
import com.example.demo.service.front.OrderService;
import com.example.demo.service.front.UserService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private OrderService orderService;

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    
    /** 🔐 共用方法：從 SecurityContext 拿登入使用者 */
    private CustomUserDetails getCurrentUserDetails() {
        return (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    /** 🔍 取得登入者資料 */
    @GetMapping("/user/me")
    public ResponseEntity<ApiResponse<UserDto>> getUserInfo() {
    	CustomUserDetails userDetails = getCurrentUserDetails();
    	if (userDetails == null) {
    	    throw new ShoppingException("尚未登入");
    	}
    	
        try {
            UserDto userDto = userService.getUserDtoByUser(userDetails.getUser());
            return ResponseEntity.ok(ApiResponse.success("取得使用者資料成功", userDto));
        } catch (ShoppingException e) {
            logger.error("取得使用者資料失敗: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            logger.error("伺服器錯誤: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.error("伺服器錯誤"));
        }
    }

    /** 📦 取得預設訂單資訊 */
    @GetMapping("/user/default-order-info")
    public ResponseEntity<ApiResponse<CreateOrderDto>> getUserOrderInfo() {
        CustomUserDetails userDetails = getCurrentUserDetails();
        UserDto userDto = userService.handleSuccessfulLogin(userDetails.getUser());
        CreateOrderDto createOrderDto = orderService.getUserDefaultToCreateOrderDto(userDto);
        return ResponseEntity.ok(ApiResponse.success("取得使用者資料成功", createOrderDto));
    }

    /** 🙋 取得個人資料 */
    @GetMapping("/user/profile")
    public ResponseEntity<ApiResponse<UserProfileDto>> getUserProfile() {
        CustomUserDetails userDetails = getCurrentUserDetails();
        Long userId = userDetails.getUser().getId();
        UserProfileDto userProfileDto = userService.getProfileDto(userId);
        return ResponseEntity.ok(ApiResponse.success("取得使用者資料成功", userProfileDto));
    }

    /** ✏️ 更新個人資料 */
    @PostMapping("/user/profile/update")
    public ResponseEntity<ApiResponse<Void>> updateUserProfile(@RequestBody UserProfileDto userProfileDto) {
        CustomUserDetails userDetails = getCurrentUserDetails();
        Long userId = userDetails.getUser().getId();
        userService.updateUser(userId, userProfileDto);
        return ResponseEntity.ok(ApiResponse.success("更新使用者資料成功", null));
    }

    /** 📝 註冊 */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(@Valid @RequestBody UserRegisterRequest request, BindingResult result) {
        if (result.hasErrors()) {
            String errorMsg = result.getAllErrors().get(0).getDefaultMessage();
            return ResponseEntity.badRequest().body(ApiResponse.error(errorMsg));
        }
        try {
            userService.register(request);
            return ResponseEntity.ok(ApiResponse.success("註冊成功", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /** 📧 信箱驗證 */
    @PostMapping("/verify-email")
    public ResponseEntity<ApiResponse<Void>> verifyEmail( @RequestBody EmailVerificationRequest req) {
        try {
            userService.verifyEmail(req.getEmail(), req.getCode());
            return ResponseEntity.ok(ApiResponse.success("驗證成功", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("失敗 " + e.getMessage()));
        }
    }
}
