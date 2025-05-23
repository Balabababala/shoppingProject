package com.example.demo.model.dto;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserDto {
	private String username;
	private Long userId;
	private Long roleId;
	private Boolean isActive;
    private Boolean isEmailVerified;
}
