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
    @PostMapping("/products/{productId}/images")
    public ResponseEntity<String> uploadImage(
            @PathVariable Long productId,
            @RequestParam Long sellerId,
            @RequestParam MultipartFile file,
            @RequestParam(required = false, defaultValue = "0") Integer number
    ) {
        productImageService.addImageToProduct(productId, sellerId, file, number);
        return ResponseEntity.ok("圖片上傳成功");
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
