package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.dto.LoginDTO;
import com.example.demo.model.dto.ResultDTO;
import com.example.demo.model.entity.User;
import com.example.demo.repository.*;

import jakarta.servlet.http.HttpSession;

@CrossOrigin(origins ="http://localhost:5173")
@RestController
public class Login {
    
    @Autowired
    private UserRepository userRepository;
    
    private ResultDTO performLogin(LoginDTO loginDTO, HttpSession session, Integer expectedRole) {
        List<User> findUser = userRepository.findByUsername(loginDTO.getUsername());

        if (findUser.isEmpty()) {
            return new ResultDTO(false, "查無使用者");
        }

        User dbUser = findUser.get(0);

        // 檢查角色是否匹配，使用 equals 方法來比較 Integer
        if (dbUser.getRoleId() != expectedRole) {
            return new ResultDTO(false, "角色不匹配");
        }

        // 密碼比對建議使用加密方式（如 BCrypt）
        if (!loginDTO.getPassword().equals(dbUser.getHashPassword())) {
            return new ResultDTO(false, "密碼錯誤");
        }

        // 檢查驗證碼
        if (!loginDTO.getCaptchaCode().equals(session.getAttribute("authCode"))) {
            return new ResultDTO(false, "驗證碼錯誤");
        }

        // 檢查帳號是否啟用
        if (!dbUser.getIsActive()) {
            return new ResultDTO(false, "帳號尚未啟用，請聯絡客服");
        }

        // 檢查是否完成信箱驗證
        if (!dbUser.getCompleted()) {
            return new ResultDTO(false, "尚未完成信箱驗證，請至信箱點擊驗證連結");
        }

        // 成功登入
        session.setAttribute("user", dbUser);
        return new ResultDTO(true, "登入成功");
    }

    @PostMapping("/api/buyerlogin")
    public ResultDTO buyerlogin(@RequestBody LoginDTO loginDTO, HttpSession session) {
        return performLogin(loginDTO, session, 1); // 1代表買家角色
    }

    @PostMapping("/api/sellerlogin")
    public ResultDTO sellerlogin(@RequestBody LoginDTO loginDTO, HttpSession session) {
        return performLogin(loginDTO, session, 2); // 2代表賣家角色
    }
}
