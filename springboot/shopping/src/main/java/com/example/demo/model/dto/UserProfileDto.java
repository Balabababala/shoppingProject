package com.example.demo.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileDto {
    private String username;
    private String email;
    private String defaultAddress;
    private String defaultReceiverName;
    private String defaultReceiverPhone;
}
