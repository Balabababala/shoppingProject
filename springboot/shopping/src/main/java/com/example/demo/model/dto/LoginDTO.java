package com.example.demo.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginDTO {
	String username;
	String password;
	String captchaCode;
	String role;  // 加入角色的 boolean 欄位
}
