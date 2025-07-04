package com.example.demo.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
//存 使用者登入 前端傳後端用
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {
	private String username;
	private String password;
	private String captchaCode;   // 使用者輸入的驗證碼
    private String captchaToken;  // 從 /auth-code 取得的 JWT token
}
