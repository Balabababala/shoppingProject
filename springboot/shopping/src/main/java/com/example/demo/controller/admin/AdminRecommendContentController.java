package com.example.demo.controller.admin;


import com.example.demo.model.dto.RecommendedProductDto;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.admin.AdminRecommendContentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/admin/recommend/content")
public class AdminRecommendContentController {

    @Autowired
    private AdminRecommendContentService adminRecommendContentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<RecommendedProductDto>>> getAllContents() {
        List<RecommendedProductDto> contents = adminRecommendContentService.getAllContents();
        return ResponseEntity.ok(ApiResponse.success("獲取推薦內容成功", contents));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RecommendedProductDto>> getContentById(@PathVariable Long id) {
        try {
            RecommendedProductDto content = adminRecommendContentService.getContentById(id);
            return ResponseEntity.ok(ApiResponse.success("獲取推薦內容成功", content));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("推薦內容不存在"));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> createContent(@Valid @RequestBody RecommendedProductDto contentDto) {
        try {
            adminRecommendContentService.createContent(contentDto);
            return ResponseEntity.ok(ApiResponse.success("新增推薦內容成功", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("新增推薦內容失敗：" + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> updateContent(@PathVariable Long id, @Valid @RequestBody RecommendedProductDto contentDto) {
        try {
            adminRecommendContentService.updateContent(id, contentDto);
            return ResponseEntity.ok(ApiResponse.success("更新推薦內容成功", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("推薦內容不存在"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("更新推薦內容失敗：" + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteContent(@PathVariable Long id) {
        try {
            adminRecommendContentService.deleteContent(id);
            return ResponseEntity.ok(ApiResponse.success("刪除推薦內容成功", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("推薦內容不存在"));
        }
    }
}