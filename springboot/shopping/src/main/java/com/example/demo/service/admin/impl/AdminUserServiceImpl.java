package com.example.demo.service.admin.impl;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.mapper.AdminGetSellerResponseMapper;
import com.example.demo.mapper.UserMapper;
import com.example.demo.model.dto.AdminGetSellerResponse;
import com.example.demo.model.dto.UserDto;
import com.example.demo.model.entity.Role;
import com.example.demo.model.entity.User;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.admin.AdminUserService;


@Service
public class AdminUserServiceImpl implements AdminUserService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;
    
    @Override
    public Optional<User> checkUser(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public UserDto handleSuccessfulLogin(User user) {
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);
        return UserMapper.toDto(user);
    }

	@Override
	public List<AdminGetSellerResponse> findAllSellers() {
		Role role = roleRepository.findById(2).get();
		return userRepository.findByRoleWithRole(role)
                 .stream()
                 .map(AdminGetSellerResponseMapper::toDto)
                 .toList();
	}

	 @Override
	    public List<UserDto> findAllUsers() {
	        // 使用 UserMapper 將 entity 轉換為 DTO
	        return userRepository.findAll().stream()
	                .map(UserMapper::toDto)
	                .toList();
	    }

	    @Override
	    public boolean updateUserStatus(Long userId, boolean isActive) {
	        Optional<User> optionalUser = userRepository.findById(userId);
	        if (optionalUser.isPresent()) {
	            User user = optionalUser.get();
	            user.setIsActive(isActive);
	            userRepository.save(user); // 儲存變更
	            return true;
	        }
	        return false;
	    }

	    @Override
	    public boolean deleteUserById(Long userId) {
	        if (userRepository.existsById(userId)) {
	            userRepository.deleteById(userId); // 真實刪除，如需軟刪除這裡改邏輯
	            return true;
	        }
	        return false;
	    }

	    @Override
	    public boolean resetUserPassword(Long userId, String newPassword) {
	        Optional<User> userOpt = userRepository.findById(userId);
	        if (userOpt.isEmpty()) {
	            return false; // 找不到使用者
	        }
	        User user = userOpt.get();
	        String encodedPassword = passwordEncoder.encode(newPassword);
	        user.setPasswordHash(encodedPassword);
	        userRepository.save(user);
	        return true;
	    }

	    @Override
	    public boolean updateUserRole(Long userId, Integer newRoleId) {
	        Optional<User> optionalUser = userRepository.findById(userId);
	        if (optionalUser.isEmpty()) {
	            return false; // 找不到使用者
	        }
	        User user = optionalUser.get();
	        
	        Optional<Role> optionalRole = roleRepository.findById(newRoleId);
	        if (optionalRole.isEmpty()) {
	            return false; // 找不到角色
	        }
	        user.setRole(optionalRole.get());

	        try {
	            userRepository.save(user);
	            return true;
	        } catch (Exception e) {
	            // 可以加上日誌紀錄錯誤訊息
	            return false;
	        }
	    }


}
