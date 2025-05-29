package com.example.demo.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
//存 使用者登入 前端傳後端用
@Data
@AllArgsConstructor
public class LoginRequest {
	private String username;
	private String password;
	private String captchaCode;
}
