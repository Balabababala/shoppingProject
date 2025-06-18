package com.example.demo.controller.admin;

import com.example.demo.model.dto.AdminGetSellerResponse;
import com.example.demo.model.dto.ResetPasswordRequest;
import com.example.demo.model.dto.UserDto;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.admin.AdminUserService;

import jakarta.servlet.http.HttpSession;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminUserController {

    @Autowired
    private AdminUserService adminUserService;

    // 取得當前登入的後台管理員資訊
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getAdminInfo(HttpSession session) {
        UserDto adminUserDto = (UserDto) session.getAttribute("adminUserDto");

        if (adminUserDto == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("尚未登入後台"));
        }

        if (adminUserDto.getRoleId() != 3) {
            return ResponseEntity.status(403).body(ApiResponse.error("權限不足"));
        }

        return ResponseEntity.ok(ApiResponse.success("取得後台使用者資料成功", adminUserDto));
    }

    // 取得所有賣家清單
//    @GetMapping("/sellers-debug")
    @GetMapping("/sellers")
    public ResponseEntity<ApiResponse<List<AdminGetSellerResponse>>> getAllSellers() {
        List<AdminGetSellerResponse> sellers = adminUserService.findAllSellers();
        return ResponseEntity.ok(ApiResponse.success("取得賣家資料成功", sellers));
    }

    // 取得所有使用者清單
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        List<UserDto> users = adminUserService.findAllUsers();
        return ResponseEntity.ok(ApiResponse.success("取得使用者清單成功", users));
    }

    // 啟用使用者
    @PutMapping("/users/{userId}/active")
    public ResponseEntity<ApiResponse<Void>> activateUser(@PathVariable Long userId) {
        boolean success = adminUserService.updateUserStatus(userId, true);
        if (success) {
            return ResponseEntity.ok(ApiResponse.success("啟用成功",null));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error("啟用失敗"));
        }
    }

    // 停用使用者
    @PutMapping("/users/{userId}/inactive")
    public ResponseEntity<ApiResponse<String>> deactivateUser(@PathVariable Long userId) {
        boolean success = adminUserService.updateUserStatus(userId, false);
        if (success) {
            return ResponseEntity.ok(ApiResponse.success("停用成功",null));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error("停用失敗"));
        }
    }

    // 刪除使用者
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable Long userId) {
        boolean success = adminUserService.deleteUserById(userId);
        if (success) {
            return ResponseEntity.ok(ApiResponse.success("刪除成功",null));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error("刪除失敗"));
        }
    }

    // 管理員重設使用者密碼
    @PutMapping("/users/{userId}/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @PathVariable Long userId,
            @RequestBody ResetPasswordRequest request) {

        boolean success = adminUserService.resetUserPassword(userId, request.getNewPassword());

        if (success) {
            return ResponseEntity.ok(ApiResponse.success("更改成功", null));
        } else {
            return ResponseEntity.badRequest().body(ApiResponse.error("更改失敗"));
        }
    }
    

    // 新增：更新使用者角色
    @PutMapping("/users/{userId}/role")
    public ResponseEntity<ApiResponse<Integer>> updateUserRole(
            @PathVariable Long userId,
            @RequestBody Map<String, Integer> roleUpdateRequest) {

        Integer newRoleId = roleUpdateRequest.get("roleId");
        if (newRoleId == null || newRoleId < 1 || newRoleId > 3) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("角色ID不合法"));
        }

        boolean updated = adminUserService.updateUserRole(userId, newRoleId);

        if (updated) {
            return ResponseEntity.ok(ApiResponse.success("成功", newRoleId));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("角色ID不合法"));
        }
    }
}
