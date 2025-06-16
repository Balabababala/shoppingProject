package com.example.demo.controller;

import com.example.demo.model.dto.ProductReviewCreateRequest;
import com.example.demo.model.dto.ProductReviewDto;
import com.example.demo.service.ProductReviewService;
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
    public ResponseEntity<ProductReviewDto> addReview(@RequestBody ProductReviewCreateRequest req) {
        try {
            ProductReviewDto dto = productReviewService.addReview(
                req.getUserId(),
                req.getProductId(),
                req.getRating(),
                req.getComment());
            return ResponseEntity.ok(dto);
        } catch (IllegalStateException | NoSuchElementException ex) {
            return ResponseEntity.badRequest().body(null);
        }
    }


    // 根據商品取得所有可見評論 (GET /api/reviews/product/{productId})
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductReviewDto>> getReviewsByProduct(@PathVariable Long productId) {
        List<ProductReviewDto> reviews = productReviewService.getReviewsByProduct(productId);
        return ResponseEntity.ok(reviews);
    }

    // 根據使用者取得評論 (GET /api/reviews/user/{userId})
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProductReviewDto>> getReviewsByUser(@PathVariable Long userId) {
        List<ProductReviewDto> reviews = productReviewService.getReviewsByUser(userId);
        return ResponseEntity.ok(reviews);
    }

    // 更新評論顯示狀態 (PUT /api/reviews/{reviewId}/visibility)
    @PutMapping("/{reviewId}/visibility")
    public ResponseEntity<ProductReviewDto> updateVisibility(
            @PathVariable Long reviewId,
            @RequestParam boolean visible) {
        try {
            ProductReviewDto dto = productReviewService.updateVisibility(reviewId, visible);
            return ResponseEntity.ok(dto);
        } catch (NoSuchElementException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    // 管理員審核評論 (PUT /api/reviews/{reviewId}/approve)
    @PutMapping("/{reviewId}/approve")
    public ResponseEntity<ProductReviewDto> approveReview(
            @PathVariable Long reviewId,
            @RequestParam boolean approved) {
        try {
            ProductReviewDto dto = productReviewService.approveReview(reviewId, approved);
            return ResponseEntity.ok(dto);
        } catch (NoSuchElementException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    // 刪除評論 (DELETE /api/reviews/{reviewId})
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long reviewId) {
        try {
            productReviewService.deleteReview(reviewId);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}
