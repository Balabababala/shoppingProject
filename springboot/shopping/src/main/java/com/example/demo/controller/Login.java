package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.LoginDTO;
import com.example.demo.dto.ResultDTO;
import com.example.demo.repository.*;

import jakarta.servlet.http.HttpSession;

@CrossOrigin(origins ="http://localhost:5173")
@RestController
public class Login {
	
	@Autowired
	private LoginRepository loginRepository;
	
	@PostMapping("/api/login")
	public ResultDTO Login (@RequestBody LoginDTO loginDTO, HttpSession session){
		
		List<LoginDTO> loginDTOs=loginRepository.findByUsername(loginDTO.getUsername());
		
		if (loginDTOs.isEmpty()) {
	          return new ResultDTO(false, "查無使用者");
	    }

	    LoginDTO dbUser = loginDTOs.get(0);

	    if (!loginDTO.getPassword().equals(dbUser.getPassword())) {
	       return new ResultDTO(false, "密碼錯誤");
	    }

	    if (!loginDTO.getCaptchaCode().equals(session.getAttribute("authCode"))) {
	          return new ResultDTO(false, "驗證碼錯誤");
	    }

	        // 成功
	        session.setAttribute("user", dbUser);
	        return new ResultDTO(true, "登入成功");	
	}
	
}
