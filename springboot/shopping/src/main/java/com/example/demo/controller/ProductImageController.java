package com.example.demo.controller;

import com.example.demo.model.dto.ProductImageDto;
import com.example.demo.service.ProductImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ProductImageController {

    @Autowired
    private ProductImageService productImageService;

    // 上傳圖片
    public void addImageToProduct(Long productId, Long sellerId, MultipartFile file, int number) {
    	
    	
    	
        // 1. 驗證賣家是否有權限操作此商品 (省略)
        // 2. 存檔（本地或雲端）
        // 3. 寫入資料庫：圖片路徑 + productId + sellerId + number (-1 是主圖，0~9 是附圖順序)
    }
 

    // 刪除圖片
    @DeleteMapping("/products/images/{imageId}")
    public ResponseEntity<String> deleteImage(
            @PathVariable Long imageId,
            @RequestParam Long sellerId
    ) {
        productImageService.deleteImage(imageId, sellerId);
        return ResponseEntity.ok("圖片刪除成功");
    }

    // 查詢商品的所有圖片
    @GetMapping("/products/{productId}/images")
    public ResponseEntity<List<ProductImageDto>> getImagesByProduct(
            @PathVariable Long productId,
            @RequestParam Long sellerId
    ) {
        List<ProductImageDto> imageList = productImageService.getImagesByProduct(productId, sellerId);
        return ResponseEntity.ok(imageList);
    }
}
