package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.demo.model.dto.LoginDTO;
import com.example.demo.model.entity.User;
import com.example.demo.repository.UserRepository;

public class UserServiceImpl implements UserService{

	@Autowired
	UserRepository userRepository;
	
	@Override
    public User findUserByUserName(String username) {
        return userRepository.findByUserName(username);
    }


	
}
