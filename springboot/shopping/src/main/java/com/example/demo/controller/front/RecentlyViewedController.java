package com.example.demo.controller.front;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.dto.RecentlyViewedResponse;
import com.example.demo.response.ApiResponse;
import com.example.demo.secure.CustomUserDetails;
import com.example.demo.service.front.RecentlyViewedService;

@RestController
@RequestMapping("/api/recent")
public class RecentlyViewedController {

    @Autowired
    private RecentlyViewedService recentlyViewedService;

    private CustomUserDetails getCurrentUserDetails() {
        return (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RecentlyViewedResponse>>> findBuyerRecentlyViewed() {
        CustomUserDetails userDetails = getCurrentUserDetails();
        Long userId = userDetails.getUser().getId();

        return ResponseEntity.ok(
            ApiResponse.success("獲取資料成功", recentlyViewedService.getRecentlyViewedByUserId(userId))
        );
    }
}
