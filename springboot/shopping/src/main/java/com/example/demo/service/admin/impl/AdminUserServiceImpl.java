package com.example.demo.service.admin.impl;


import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.mapper.UserMapper;
import com.example.demo.model.dto.UserDto;
import com.example.demo.model.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.admin.AdminUserService;


@Service
public class AdminUserServiceImpl implements AdminUserService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

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
}
