package com.example.demo.mapper;



import com.example.demo.model.dto.UserDto;
import com.example.demo.model.entity.User;

public class UserMapper {
	public static UserDto toDto(User user) {
		if(user==null) {
			return null;
		}
		UserDto userDto =new UserDto();
		userDto.setUsername(user.getUsername());
		userDto.setUserId(user.getId());
		userDto.setRole(user.getRole().getName());
		userDto.setIsActive(user.getIsActive());
		userDto.setIsEmailVerified(user.getIsEmailVerified());
		return userDto;
    }

}
