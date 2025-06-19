package com.example.demo.mapper;



import com.example.demo.model.dto.AdminRecentlyViewedDto;
import com.example.demo.model.entity.RecentlyViewed;

public class AdminRecentlyViewedMapper {

    public static AdminRecentlyViewedDto toDto(RecentlyViewed recentlyViewed) {
        if (recentlyViewed == null) return null;
        AdminRecentlyViewedDto adminRecentlyViewedDto = new AdminRecentlyViewedDto();
        adminRecentlyViewedDto.setId(recentlyViewed.getId());
        adminRecentlyViewedDto.setUsername(recentlyViewed.getUser() != null ? recentlyViewed.getUser().getUsername() : null);
        adminRecentlyViewedDto.setProductName(recentlyViewed.getProduct() != null ? recentlyViewed.getProduct().getName() : null);
        adminRecentlyViewedDto.setViewedAt(recentlyViewed.getViewedAt());
        return adminRecentlyViewedDto;
    }
}
