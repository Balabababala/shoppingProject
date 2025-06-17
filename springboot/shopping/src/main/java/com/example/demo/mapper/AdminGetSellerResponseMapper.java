package com.example.demo.mapper;

import com.example.demo.model.dto.AdminGetSellerResponse;

import com.example.demo.model.entity.User;

public class AdminGetSellerResponseMapper {
	
	public static AdminGetSellerResponse toDto(User seller) {
		AdminGetSellerResponse adminGetSellerResponse = new AdminGetSellerResponse();
		adminGetSellerResponse.setEmail(seller.getEmail());
		adminGetSellerResponse.setId(seller.getId());
		adminGetSellerResponse.setName(seller.getUsername());
	    return adminGetSellerResponse;
	}
}
