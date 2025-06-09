package com.example.demo.mapper;

import com.example.demo.model.dto.UserProfileDto;
import com.example.demo.model.entity.User;

public class UserProfileMapper {

    public static UserProfileDto toDto(User user) {
        if (user == null) {
            return null;
        }
        UserProfileDto dto = new UserProfileDto();
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setDefaultAddress(user.getDefaultAddress());
        dto.setDefaultReceiverName(user.getDefaultReceiverName());
        dto.setDefaultReceiverPhone(user.getDefaultReceiverPhone());
        return dto;
    }
}
