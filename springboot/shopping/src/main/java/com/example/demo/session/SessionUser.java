package com.example.demo.session;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SessionUser {
	String username;
	Long userId;
	Long roleId;
	private Boolean isActive;
    private Boolean isEmailVerified;
}
