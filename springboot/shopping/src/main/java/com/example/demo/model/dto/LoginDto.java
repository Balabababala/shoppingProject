package com.example.demo.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
//存 使用者登入
@Data
@AllArgsConstructor
public class LoginDto {
	private String username;
	private String password;
	private String captchaCode;
}
