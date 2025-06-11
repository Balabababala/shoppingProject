package com.example.demo.service.Impl;


import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import com.example.demo.exception.ShoppingException;
import com.example.demo.mapper.UserMapper;
import com.example.demo.mapper.UserProfileMapper;
import com.example.demo.model.dto.LoginRequest;
import com.example.demo.model.dto.UserDto;
import com.example.demo.model.dto.UserProfileDto;
import com.example.demo.model.dto.UserRegisterRequest;
import com.example.demo.model.entity.Role;
import com.example.demo.model.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.EmailService;
import com.example.demo.service.LoginLogService;
import com.example.demo.service.RoleService;
import com.example.demo.service.UserService;
import com.example.demo.util.GenerateVerificationCode;
import com.example.demo.util.PasswordHash;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@Service
public class UserServiceImpl implements UserService{

	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private LoginLogService loginLogService;
	
	@Autowired
	private EmailService emailService;
	
	@Autowired
	private RoleService roleService;
	
	//repository

	@Override
	public Optional<User> findById(Long Id) {
		return userRepository.findById(Id);
	}

	@Override
	public Optional<User> findByUsername(String username) {
		return userRepository.findByUsername(username);
	}
	

	@Override
	public Optional<User> findByEmail(String email) {
		return userRepository.findByEmail(email);
	}

	@Override
	public void save(User user) {
		userRepository.save(user);
	}

	//邏輯
	
	@Override
	public void updateUser(Long userId,UserProfileDto userProfileDto) {
		User user= findById(userId).get();
		user.setDefaultAddress(userProfileDto.getDefaultAddress());
		user.setDefaultReceiverName(userProfileDto.getDefaultReceiverName());
		user.setDefaultReceiverPhone(userProfileDto.getDefaultReceiverPhone());
		save(user);
	}
	
	@Override
	 public void register(UserRegisterRequest request) throws Exception {
		 System.out.println("Registering with email: " + request.getEmail());
		    System.out.println("Registering with username: " + request.getUsername());

		    Optional<User> userByEmail = findByEmail(request.getEmail());
		    System.out.println("findByEmail present? " + userByEmail.isPresent());

		    Optional<User> userByUsername = findByUsername(request.getUsername());
		    System.out.println("findByUsername present? " + userByUsername.isPresent());

		    if (userByEmail.isPresent() || userByUsername.isPresent()) {
		        throw new RuntimeException("Email 或 Username 已存在");
		    }
		    
	        if (findByEmail(request.getEmail()).isPresent()
	                || findByUsername(request.getUsername()).isPresent()) {
	            throw new RuntimeException("Email 或 Username 已存在");
	        }

	        User user = new User();
	        user.setUsername(request.getUsername());
	        user.setEmail(request.getEmail());

	        // 用 BCryptPasswordEncoder 編碼密碼，不用自己生成 salt
	        String encodedPassword = passwordEncoder.encode(request.getPassword());
	        user.setPasswordHash(encodedPassword);

	        user.setIsActive(true);
	        user.setIsEmailVerified(false);


	        user.setUsername(request.getUsername());
	        user.setEmail(request.getEmail());
	        user.setIsActive(true);
	        user.setIsEmailVerified(false);

	        user.setDefaultAddress(request.getDefaultAddress());
	        user.setDefaultReceiverName(request.getDefaultReceiverName());
	        user.setDefaultReceiverPhone(request.getDefaultReceiverPhone());

	        Integer roleId = request.getRoleId();
	        if (roleId == null || roleId > 2) {
	            throw new RuntimeException("Invalid roleId");
	        }
	        Role role = roleService.findByRoleId(roleId)
	                .orElseThrow(() -> new RuntimeException("Role not found"));
	        user.setRole(role);

	        // 產生驗證碼
	        String verificationCode = GenerateVerificationCode.generateVerificationCode();
	        user.setEmailVerificationCode(verificationCode);
	        user.setEmailVerificationExpireTime(LocalDateTime.now().plusHours(24));

	        userRepository.save(user);

	        // 寄驗證信
	        emailService.sendVerificationEmail(user.getEmail(), verificationCode);
	    }

	 @Override
	    public void verifyEmail(String email, String code) {
	        User user = findByEmail(email)
	                .orElseThrow(() -> new RuntimeException("User not found"));

	        if (user.getIsEmailVerified()) {
	            throw new RuntimeException("Email 已驗證");
	        }

	        if (user.getEmailVerificationExpireTime() == null
	                || LocalDateTime.now().isAfter(user.getEmailVerificationExpireTime())) {
	            throw new RuntimeException("驗證碼已過期，請重新註冊");
	        }

	        if (!user.getEmailVerificationCode().equalsIgnoreCase(code)) {
	        	throw new RuntimeException("驗證碼錯誤");
	        }

	        user.setIsEmailVerified(true);
	        user.setEmailVerificationCode(null);
	        user.setEmailVerificationExpireTime(null);
	        userRepository.save(user);
	    }


	@Override
    public User findUserByUserName(String username) {
        return findByUsername(username).get();
    }

	@Override
	public User findUserById(Long id) {
		return findById(id)
	            .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
	}
	@Override
	public UserDto handleSuccessfulLogin(User user) {
		user.setLastLoginAt(LocalDateTime.now());     //更新 最近登入時間
		save(user);
		UserDto userDto=UserMapper.toDto(user);
		return userDto;
	}

	@Override
	public UserProfileDto getProfileDto(Long id) {
		return UserProfileMapper.toDto(findById(id).orElseThrow(()->new ShoppingException("沒找到?")));
	}
}
