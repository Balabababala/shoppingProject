package com.example.demo.model.entity;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class User {
	private Integer id;
    private String username;
    private String hashPassword;
    private String hashSalt;
    private String email;
    private Integer roleId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastLoginAt;
    private Boolean isActive;
    private Boolean completed;
}
