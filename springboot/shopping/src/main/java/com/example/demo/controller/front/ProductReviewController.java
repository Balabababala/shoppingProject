package com.example.demo.controller.front;

import com.example.demo.model.dto.ProductReviewCreateRequest;
import com.example.demo.model.dto.ProductReviewDto;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.front.ProductReviewService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/reviews")
public class ProductReviewController {

    @Autowired
    private ProductReviewService productReviewService;

    // 新增評論 (POST /api/reviews)
    @PostMapping
    public ResponseEntity<ApiResponse<ProductReviewDto>> addReview(@RequestBody ProductReviewCreateRequest productReviewCreateRequest) {
        try {
            ProductReviewDto dto = productReviewService.addReview(
            	productReviewCreateRequest.getUserId(),
            	productReviewCreateRequest.getProductId(),
            	productReviewCreateRequest.getRating(),
            	productReviewCreateRequest.getComment());
            return ResponseEntity.ok(ApiResponse.success("成功", dto));
        } catch (IllegalStateException | NoSuchElementException ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error("失敗"));
        }
    }


    // 根據商品取得所有可見評論 (GET /api/reviews/product/{productId})
    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<List<ProductReviewDto>>> getReviewsByProduct(@PathVariable Long productId) {
        List<ProductReviewDto> reviews = productReviewService.getReviewsByProduct(productId);
        System.out.print(reviews.get(0).getComment()+"AAAAAAAAAAAAAAAAAAAAAAAAAAA");
        return ResponseEntity.ok(ApiResponse.success("成功", reviews));
    }

    // 根據使用者取得評論 (GET /api/reviews/user/{userId})
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<ProductReviewDto>>> getReviewsByUser(@PathVariable Long userId) {
        List<ProductReviewDto> reviews = productReviewService.getReviewsByUser(userId);
        return ResponseEntity.ok(ApiResponse.success("成功", reviews));
    }

    // 更新評論顯示狀態 (PUT /api/reviews/{reviewId}/visibility)
    @PutMapping("/{reviewId}/visibility")
    public ResponseEntity<ApiResponse<Void>> updateVisibility(
            @PathVariable Long reviewId,
            @RequestParam boolean visible) {
        try {
            ProductReviewDto dto = productReviewService.updateVisibility(reviewId, visible);
            return ResponseEntity.ok(ApiResponse.success("成功", null));  
        } catch (NoSuchElementException ex) {
        	
            return ResponseEntity.badRequest().body(ApiResponse.error("失敗"));  
        }
    }

    // 管理員審核評論 (PUT /api/reviews/{reviewId}/approve)
    @PutMapping("/{reviewId}/approve")
    public ResponseEntity<ApiResponse<Void>> approveReview(
            @PathVariable Long reviewId,
            @RequestParam boolean approved) {
        try {
            ProductReviewDto dto = productReviewService.approveReview(reviewId, approved);
            return ResponseEntity.ok(ApiResponse.success("成功", null));
        } catch (NoSuchElementException ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error("失敗"));  
        }
    }

    // 刪除評論 (DELETE /api/reviews/{reviewId})
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable Long reviewId) {
        try {
            productReviewService.deleteReview(reviewId);
            return ResponseEntity.ok(ApiResponse.success("成功", null));
        } catch (NoSuchElementException ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error("失敗"));  
        }
    }
}
