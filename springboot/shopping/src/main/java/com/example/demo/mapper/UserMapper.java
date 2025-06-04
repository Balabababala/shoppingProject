package com.example.demo.mapper;



import com.example.demo.model.dto.UserDto;
import com.example.demo.model.entity.User;

public class UserMapper {
	public static UserDto toDto(User user) {
        return new UserDto(
        		user.getUsername(),
        		user.getId(),
        		user.getRole().getId(),
        		user.getIsActive(),
        		user.getIsEmailVerified()
        );
    }
}
