package com.example.demo.controller.front;

import com.example.demo.model.dto.SellerProductCreateRequest;
import com.example.demo.model.dto.SellerProductResponse;
import com.example.demo.response.ApiResponse;
import com.example.demo.secure.CustomUserDetails;
import com.example.demo.service.front.ProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seller/products")
public class SellerProductController {

    @Autowired
    private ProductService productService;

    
    private CustomUserDetails getCurrentUserDetails() {
        return (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    /**
     * 取得該賣家所有商品
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<SellerProductResponse>>> getSellerProducts() {
    	
        Long userId = getCurrentUserDetails().getUser().getId();
        List<SellerProductResponse> responses = productService.getSellerProduct(userId);
        return ResponseEntity.ok(ApiResponse.success("取得賣家所有商品成功", responses));
    }

    /**
     * 新增商品（支援多圖上傳）
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Void>> addProduct(@ModelAttribute SellerProductCreateRequest sellerProductDto) {
        if (sellerProductDto.getThumbnail() != null) {
            System.out.println("主圖名稱：" + sellerProductDto.getThumbnail().getOriginalFilename());
        }
        if (sellerProductDto.getExtraImages() != null) {
            sellerProductDto.getExtraImages().forEach(file ->
                    System.out.println("其他圖名稱：" + file.getOriginalFilename()));
        }

        Long userId = getCurrentUserDetails().getUser().getId();
        productService.addProduct(sellerProductDto, userId);
        return ResponseEntity.ok(ApiResponse.success("新增成功", null));
    }

    /**
     * 修改商品資料（支援多圖）
     */
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Void>> updateProduct(
            @PathVariable Long id,
            @ModelAttribute SellerProductCreateRequest sellerProductCreateRequest) {

        Long userId = getCurrentUserDetails().getUser().getId();
        productService.updateProduct(sellerProductCreateRequest, id, userId);
        return ResponseEntity.ok(ApiResponse.success("修改成功", null));
    }

    /**
     * 刪除商品（軟刪除）
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        Long userId = getCurrentUserDetails().getUser().getId();
        productService.deleteProduct(id, userId);
        return ResponseEntity.ok(ApiResponse.success("刪除成功", null));
    }

    /**
     * 商品下架
     */
    @PutMapping("/{id}/unactive")
    public ResponseEntity<ApiResponse<Void>> unActiveProduct(@PathVariable Long id) {
        Long userId = getCurrentUserDetails().getUser().getId();
        productService.unActiveProduct(id, userId);
        return ResponseEntity.ok(ApiResponse.success("下架成功", null));
    }

    /**
     * 商品上架
     */
    @PutMapping("/{id}/active")
    public ResponseEntity<ApiResponse<Void>> activeProduct(@PathVariable Long id) {
        Long userId = getCurrentUserDetails().getUser().getId();
        productService.activeProduct(id, userId);
        return ResponseEntity.ok(ApiResponse.success("上架成功", null));
    }

    /**
     * 取得單一商品詳細資料（賣家限定）
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SellerProductResponse>> getProductById(@PathVariable Long id) {
        Long userId = getCurrentUserDetails().getUser().getId();
        SellerProductResponse response = productService.findProductByIdToSellerProductDto(id, userId);
        return ResponseEntity.ok(ApiResponse.success("取得單一商品詳細資料成功", response));
    }
}
