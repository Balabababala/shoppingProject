package com.example.demo.service;


import com.example.demo.model.entity.User;


public interface UserService {
	public User findUserByUserName(String userName);
}
