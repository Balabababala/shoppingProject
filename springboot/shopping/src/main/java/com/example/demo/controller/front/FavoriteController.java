package com.example.demo.controller.front;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.example.demo.exception.ShoppingException;
import com.example.demo.model.dto.FavoriteDto;
import com.example.demo.response.ApiResponse;
import com.example.demo.secure.CustomUserDetails;
import com.example.demo.service.front.FavoriteService;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    private CustomUserDetails getCurrentUserDetails() {
        return (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @PostMapping // 新增收藏
    public ResponseEntity<ApiResponse<Void>> addFavorite(@RequestBody FavoriteDto favoriteDto) {
        CustomUserDetails userDetails = getCurrentUserDetails();

        try {
            favoriteService.addFavoriteByUserIdAndProductId(userDetails.getUser().getId(), favoriteDto.getProductId());
            return ResponseEntity.ok(ApiResponse.success("收藏成功", null));
        } catch (ShoppingException e) {
            // 如果是已經加入收藏也當成功回應，依你原本邏輯
            return ResponseEntity.ok(ApiResponse.success("已加入收藏", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("加入收藏失敗"));
        }
    }

    @DeleteMapping("/{productId}") // 刪除收藏
    public ResponseEntity<ApiResponse<Void>> deleteFavorite(@PathVariable Long productId) {
        CustomUserDetails userDetails = getCurrentUserDetails();

        try {
            favoriteService.deleteFavoriteByUserIdAndProductId(userDetails.getUser().getId(), productId);
            return ResponseEntity.ok(ApiResponse.success("刪除收藏成功", null));
        } catch (ShoppingException e) {
            return ResponseEntity.ok(ApiResponse.success("未加入收藏", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("刪除收藏失敗"));
        }
    }

    @GetMapping // 取得目前登入者的收藏清單
    public ResponseEntity<ApiResponse<List<FavoriteDto>>> getFavorites() {
        CustomUserDetails userDetails = getCurrentUserDetails();

        List<FavoriteDto> list = favoriteService.findFavoriteByUserId(userDetails.getUser().getId());
        return ResponseEntity.ok(ApiResponse.success("找到收藏成功", list));
    }

    @GetMapping("/check") // 檢查商品是否已收藏
    public ResponseEntity<ApiResponse<Boolean>> checkFavorite(@RequestParam Long productId) {
        CustomUserDetails userDetails = getCurrentUserDetails();

        boolean isFavorite = !favoriteService.findByUserIdAndProductId(userDetails.getUser().getId(), productId).isEmpty();
        return ResponseEntity.ok(ApiResponse.success("成功", isFavorite));
    }
}
