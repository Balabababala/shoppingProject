package com.example.demo.model.dto;


import com.example.demo.model.entity.Role;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
//前後都用
@Data
@AllArgsConstructor
@NoArgsConstructor

public class UserDto {
	private String username;
	private Long userId;
	private String role;
	private Boolean isActive;
    private Boolean isEmailVerified;
}
