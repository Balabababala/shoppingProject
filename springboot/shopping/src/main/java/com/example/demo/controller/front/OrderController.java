package com.example.demo.controller.front;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.example.demo.exception.ShoppingException;
import com.example.demo.model.dto.CreateOrderDto;
import com.example.demo.model.dto.OrderResponse;

import com.example.demo.response.ApiResponse;
import com.example.demo.secure.CustomUserDetails;
import com.example.demo.service.front.OrderService;

@RestController
@RequestMapping("/api")
public class OrderController {

	@Autowired
    private OrderService orderService;


    // 取得目前登入使用者 id（可依你的 CustomUserDetails 或 JWT payload 調整）
	private CustomUserDetails getCurrentUserDetails() {
        return (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

	//建造
    @PostMapping("/buyer/order/create")
    public ResponseEntity<ApiResponse<Void>> createOrder(@RequestBody CreateOrderDto orderRequest) {
    	CustomUserDetails customUserDetails =getCurrentUserDetails ();

        orderService.createOrder(orderRequest, customUserDetails.getUser().getId());
        return ResponseEntity.ok(ApiResponse.success("結帳成功", null));
    }

    // 查看買家訂單
    @GetMapping("/buyer/orders/{userId}")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrdersByBuyerId(@PathVariable Long userId) {
    	CustomUserDetails customUserDetails =getCurrentUserDetails ();
    	Long currentUserId=customUserDetails.getUser().getId();
    	
    	if (currentUserId == null || !currentUserId.equals(userId)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("無權限查看該資料"));
        }
    	
        List<OrderResponse> orderResponses = orderService.getOrderByBuyerId(userId);
        return ResponseEntity.ok(ApiResponse.success("取得資料成功", orderResponses));
    }

	// 取消訂單
    @PutMapping("/buyer/orders/{orderId}/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelOrder(@PathVariable Long orderId) {
        CustomUserDetails customUserDetails = getCurrentUserDetails();
        if (customUserDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("尚未登入"));
        }

        Long currentUserId = customUserDetails.getUser().getId();

        boolean owned = orderService.isOrderOwnedByUser(orderId, currentUserId);
        if (!owned) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error("無權限取消此訂單"));
        }

        orderService.cancelOrder(orderId);
        return ResponseEntity.ok(ApiResponse.success("訂單已成功取消", null));
    }

//@@@@@@@@@@@@@@@@@@@@@@@@@@@賣家@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    // 查看賣家訂單
    @GetMapping("/seller/orders/{userId}")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrdersBySellerId(@PathVariable Long userId) {
    	CustomUserDetails customUserDetails =getCurrentUserDetails ();
    	Long currentUserId=customUserDetails.getUser().getId();
    	
    	if (currentUserId == null || !currentUserId.equals(userId)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("無權限查看該資料"));
        }
    	
        List<OrderResponse> orderResponses = orderService.getOrderBySellerId(userId);
        return ResponseEntity.ok(ApiResponse.success("取得資料成功", orderResponses));
    }
    
	 // 賣家標記訂單為已出貨
	    @PutMapping("/seller/orders/{orderId}/ship")
	    public ResponseEntity<ApiResponse<Void>> shipOrder(@PathVariable Long orderId) {
	        CustomUserDetails customUserDetails = getCurrentUserDetails();
	        Long sellerId = customUserDetails.getUser().getId();
	
	        try {
	            orderService.shipOrder(orderId, sellerId);
	            return ResponseEntity.ok(ApiResponse.success("已標記為出貨", null));
	        } catch (ShoppingException e) {
	            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
	        }
	    }
	    
	    //賣方取消訂單
	    @PutMapping("/seller/orders/{orderId}/cancel")
	    public ResponseEntity<ApiResponse<Void>> sellerCancelOrder(@PathVariable Long orderId) {
	        CustomUserDetails customUserDetails = getCurrentUserDetails();

	        Long currentUserId = customUserDetails.getUser().getId();

	        // 判斷賣家是否擁有此訂單
	        boolean ownedBySeller = orderService.isOrderOwnedBySeller(orderId, currentUserId);
	        if (!ownedBySeller) {
	            return ResponseEntity.status(HttpStatus.FORBIDDEN)
	                .body(ApiResponse.error("無權限取消此訂單"));
	        }

	        // 檢查訂單狀態是否允許取消
	        try {
	            String orderStatus = orderService.getOrderStatus(orderId);
	            if ("SHIPPED".equals(orderStatus) || "CANCELLED".equals(orderStatus) || "COMPLETED".equals(orderStatus)) {
	                return ResponseEntity.badRequest().body(ApiResponse.error("此訂單無法取消"));
	            }

	            orderService.cancelOrder(orderId);
	            return ResponseEntity.ok(ApiResponse.success("訂單已成功取消", null));
	        } catch (ShoppingException e) {
	            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
	        }
	    }

}