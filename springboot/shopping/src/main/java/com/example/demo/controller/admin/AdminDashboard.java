package com.example.demo.controller.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.response.ApiResponse;
import com.example.demo.service.admin.AdminOrderService;
import com.example.demo.model.dto.AdminDashboardResponse;

import java.math.BigDecimal;


@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboard {

    @Autowired
    private AdminOrderService adminOrderService;

    @GetMapping
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> getDashboardStats() {
    	AdminDashboardResponse adminDashboardResponse = new AdminDashboardResponse();

        adminDashboardResponse.setOrderCount(adminOrderService.count());
        adminDashboardResponse.setTotalSales(adminOrderService.calculateTotalSales());

        return ResponseEntity.ok(ApiResponse.success("取得dashboard資訊成功", adminDashboardResponse));
    }
}
