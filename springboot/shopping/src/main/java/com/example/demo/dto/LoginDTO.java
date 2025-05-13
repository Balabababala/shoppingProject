package com.example.demo.dto;

import lombok.Data;

@Data
public class LoginDTO {
	String username;
	String password;
	String captchaCode;
}
