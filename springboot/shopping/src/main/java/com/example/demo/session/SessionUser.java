package com.example.demo.session;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SessionUser {
	String userName;
	Integer roleId;
	private Boolean isActive;
    private Boolean isEmailVerified;
}
