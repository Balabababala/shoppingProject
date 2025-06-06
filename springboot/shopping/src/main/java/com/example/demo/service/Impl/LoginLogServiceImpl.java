package com.example.demo.service.Impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import com.example.demo.model.dto.UserDto;
import com.example.demo.model.entity.LoginLog;
import com.example.demo.model.entity.User;
import com.example.demo.repository.LoginLogRepository;
import com.example.demo.service.LoginLogService;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class LoginLogServiceImpl implements LoginLogService{
	
	@Autowired
	private LoginLogRepository loginLogRepository;
	
	//Repository
	@Override
	public
	void save(LoginLog loginLog) {
		loginLogRepository.save(loginLog);
	}
	
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
		
		save(loginLog);
	}
}
