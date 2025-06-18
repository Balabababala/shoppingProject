package com.example.demo.controller.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.dto.AdminOrderDto;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.admin.AdminOrderService;


import java.util.List;



@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {

    @Autowired
    private AdminOrderService adminOrderService;

    // 不用分頁，全部回傳
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<AdminOrderDto>>> searchOrders( 
    		@RequestParam(required = false) String orderNumber,
    		@RequestParam(required = false) String userName) {
    	return ResponseEntity.ok(ApiResponse.success("搜尋成功", adminOrderService.searchOrdersNoPage(orderNumber, userName)));
    }

    //取詳細資料
    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<AdminOrderDto>> getOrderById(@PathVariable Long orderId) {
        AdminOrderDto order = adminOrderService.getOrderById(orderId);
        if (order == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("訂單不存在"));
        }
        return ResponseEntity.ok(ApiResponse.success("搜尋成功", order));
    }
}
