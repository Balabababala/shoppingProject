package com.example.demo.controller.admin;

import com.example.demo.model.dto.ProductReviewDto;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.front.ProductReviewService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/reviews")
// @Tag(name = "後台 - 評論管理") // 若使用 Swagger 註解
public class AdminReviewController {

    @Autowired
    private ProductReviewService productReviewService;

    /**
     * 取得所有評論（包含未審核與隱藏的）
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductReviewDto>>> getAllReviews() {
        List<ProductReviewDto> allReviews = productReviewService.getAllReviews();
        return ResponseEntity.ok(ApiResponse.success("成功取得評論列表", allReviews));
    }

    /**
     * 審核評論（通過或不通過）
     * @param reviewId 評論 ID
     * @param approved 是否通過
     */
    @PatchMapping("/{reviewId}/approve")
    public ResponseEntity<ApiResponse<ProductReviewDto>> approveReview(
            @PathVariable Long reviewId,
            @RequestParam boolean approved) {

        ProductReviewDto updated = productReviewService.approveReview(reviewId, approved);
        return ResponseEntity.ok(ApiResponse.success("審核結果已更新", updated));
    }

    /**
     * 顯示或隱藏評論
     * @param reviewId 評論 ID
     * @param visible 是否顯示
     */
    @PatchMapping("/{reviewId}/visibility")
    public ResponseEntity<ApiResponse<ProductReviewDto>> updateVisibility(
            @PathVariable Long reviewId,
            @RequestParam boolean visible) {

        ProductReviewDto updated = productReviewService.updateVisibility(reviewId, visible);
        return ResponseEntity.ok(ApiResponse.success("顯示狀態已更新", updated));
    }

    /**
     * 刪除評論
     * @param reviewId 評論 ID
     */
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable Long reviewId) {
        productReviewService.deleteReview(reviewId);
        return ResponseEntity.ok(ApiResponse.success("評論已刪除", null));
    }
}
