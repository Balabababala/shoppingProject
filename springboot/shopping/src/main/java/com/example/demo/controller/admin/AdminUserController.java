package com.example.demo.controller.admin;

import com.example.demo.model.dto.UserDto;
import com.example.demo.response.ApiResponse;

import jakarta.servlet.http.HttpSession;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminUserController {

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getAdminInfo(HttpSession session) {
        // 從 session 拿 admin 資料（你需要在後台登入時把 adminUserDto 存到 session）
        UserDto adminUserDto = (UserDto) session.getAttribute("adminUserDto");

        if (adminUserDto == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("尚未登入後台"));
        }

        // 這邊可以加角色檢查，例如 roleId 是否是後台管理員
        if (adminUserDto.getRoleId() != 3) { 
            return ResponseEntity.status(403).body(ApiResponse.error("權限不足"));
        }

        return ResponseEntity.ok(ApiResponse.success("取得後台使用者資料成功", adminUserDto));
    }
}
