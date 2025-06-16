package com.example.demo.service.admin.impl;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;


import com.example.demo.model.entity.LoginLog;
import com.example.demo.model.entity.User;
import com.example.demo.repository.LoginLogRepository;
import com.example.demo.service.admin.AdminLoginLogService;
import com.example.demo.service.front.LoginLogService;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class AdminLoginLogServiceImpl implements AdminLoginLogService{
	
	@Autowired
	private LoginLogRepository loginLogRepository;
	

	
	//邏輯
	@Override
	public void createLoginLog(User user , HttpServletRequest request,Boolean success) {
		String ip = request.getHeader("X-Forwarded-For");
		if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
		    ip = request.getRemoteAddr();
		} else if (ip.contains(",")) {
		    ip = ip.split(",")[0].trim(); // 只取第一個 IP
		}

		String userAgent = request.getHeader("User-Agent"); 
		
		LoginLog loginLog =new LoginLog(); 
		loginLog.setIpAddress(ip);
		loginLog.setSuccess(true);
		loginLog.setUser(user);
		loginLog.setUserAgent(userAgent);
		
		loginLogRepository.save(loginLog);
	}
}
