package com.example.demo.controller.front;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.dto.AddCartItemRequest;
import com.example.demo.model.dto.CartItemResponse;
import com.example.demo.response.ApiResponse;
import com.example.demo.secure.CustomUserDetails;
import com.example.demo.service.front.CartItemService;

@RestController
@RequestMapping("/api/cart")
public class CartItemController {
    @Autowired
    private CartItemService cartItemService;

    private CustomUserDetails getCurrentUserDetails() {
        return (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @GetMapping // contexts 用
    public ResponseEntity<ApiResponse<List<CartItemResponse>>> getCart() {
        CustomUserDetails userDetails = getCurrentUserDetails();
        return ResponseEntity.ok(ApiResponse.success("取購物車成功", cartItemService.getCart(userDetails.getUser().getId())));
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<Object>> addCart(@RequestBody AddCartItemRequest addCartItemRequest) {
        CustomUserDetails userDetails = getCurrentUserDetails();
        cartItemService.addOrUpdateCartItem(userDetails.getUser().getId(), addCartItemRequest.getProductId(), addCartItemRequest.getQuantity());
        return ResponseEntity.ok(ApiResponse.success("加入成功", null));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse<Object>> deleteCart(@PathVariable Long productId) {
        CustomUserDetails userDetails = getCurrentUserDetails();
        cartItemService.deleteItemFromCart(userDetails.getUser().getId(), productId);
        return ResponseEntity.ok(ApiResponse.success("刪除成功", null));
    }

    @DeleteMapping("/clear") // cartItem 清除
    public ResponseEntity<ApiResponse<Object>> clearCart() {
        CustomUserDetails userDetails = getCurrentUserDetails();
        cartItemService.clearCart(userDetails.getUser().getId());
        return ResponseEntity.ok(ApiResponse.success("刪購物車成功", null));
    }
}
