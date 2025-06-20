package com.example.demo.controller.front;

import com.example.demo.model.dto.ProductReviewCreateRequest;
import com.example.demo.model.dto.ProductReviewDto;
import com.example.demo.response.ApiResponse;
import com.example.demo.secure.CustomUserDetails;
import com.example.demo.service.front.ProductReviewService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/reviews")
public class ProductReviewController {

    @Autowired
    private ProductReviewService productReviewService;

    // 取得目前登入使用者 CustomUserDetails
    private CustomUserDetails getCurrentUserDetails() {
        return (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    // 新增評論，從 JWT 取 userId
    @PostMapping
    public ResponseEntity<ApiResponse<Void>> addReview(@RequestBody ProductReviewCreateRequest request) {
        try {
        	CustomUserDetails customUserDetails = getCurrentUserDetails();
            Long userId = customUserDetails.getUser().getId();
            productReviewService.addReview(
                userId,
                request.getProductId(),
                request.getRating(),
                request.getComment()
            );
            return ResponseEntity.ok(ApiResponse.success("成功", null));
        } catch (IllegalStateException | NoSuchElementException ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error("失敗: " + ex.getMessage()));
        }
    }
    
    //是否已評論過該商品用
    @GetMapping("/check")
    public ResponseEntity<ApiResponse<Boolean>> checkIfReviewed(
        @RequestParam Long userId,
        @RequestParam Long productId) {

        boolean exists = productReviewService.existsByUserAndProduct(userId, productId);
        return ResponseEntity.ok(ApiResponse.success("查詢成功", exists));
    }

    // 根據商品取得所有可見評論
    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<List<ProductReviewDto>>> getReviewsByProduct(@PathVariable Long productId) {
        List<ProductReviewDto> reviews = productReviewService.getReviewsByProduct(productId);
        return ResponseEntity.ok(ApiResponse.success("成功", reviews));
    }

    // 取得目前使用者自己的評論 (改用 JWT)
    @GetMapping("/user/me")
    public ResponseEntity<ApiResponse<List<ProductReviewDto>>> getMyReviews() {
    	CustomUserDetails customUserDetails = getCurrentUserDetails();
        Long userId = customUserDetails.getUser().getId();
        List<ProductReviewDto> reviews = productReviewService.getReviewsByUser(userId);
        return ResponseEntity.ok(ApiResponse.success("成功", reviews));
    }
}
