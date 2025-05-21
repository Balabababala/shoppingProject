package com.example.demo.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
//存 使用者登入
@Data
@AllArgsConstructor
public class LoginDTO {
	String userName;
	String password;
	String captchaCode;
	String role;  // 加入角色的 boolean 欄位
}
