package com.example.demo.service.admin;

import com.example.demo.model.entity.LoginLog;
import com.example.demo.model.entity.User;

import jakarta.servlet.http.HttpServletRequest;

public interface AdminLoginLogService {

	
	//邏輯
	void createLoginLog(User user,HttpServletRequest request, Boolean success);
}
