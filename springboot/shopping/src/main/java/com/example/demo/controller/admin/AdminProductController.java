package com.example.demo.controller.admin;

import com.example.demo.model.dto.AdminProductCreateRequest;
import com.example.demo.model.dto.AdminProductResponse;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.front.ProductService;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {

    @Autowired
    private ProductService productService;


    /** 取得所有商品（後台管理） **/
    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminProductResponse>>> getAllProducts(HttpSession session) {
        // 可加權限檢查
        List<AdminProductResponse> products = productService.getAllProductsForAdmin();
        return ResponseEntity.ok(ApiResponse.success("取得所有商品成功", products));
    }

    /** 新增商品 **/
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Void>> addProduct(@Valid @ModelAttribute AdminProductCreateRequest request,
                                                        HttpSession session) {
        // 可加權限檢查
        productService.addProductByAdmin(request);
        return ResponseEntity.ok(ApiResponse.success("新增商品成功", null));
    }

    /** 修改商品 **/
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Void>> updateProduct(@PathVariable Long id,
                                                           @Valid @ModelAttribute AdminProductCreateRequest request,
                                                           HttpSession session) {
        // 可加權限檢查
        productService.updateProductByAdmin(id, request);
        return ResponseEntity.ok(ApiResponse.success("修改商品成功", null));
    }

    /** 刪除商品 **/
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id, HttpSession session) {
        // 可加權限檢查
        productService.deleteProductByAdmin(id);
        return ResponseEntity.ok(ApiResponse.success("刪除商品成功", null));
    }

    /** 商品下架 **/
    @PutMapping("/{id}/unactive")
    public ResponseEntity<ApiResponse<Void>> unactiveProduct(@PathVariable Long id, HttpSession session) {
        // 可加權限檢查
        productService.unActiveProductByAdmin(id);
        return ResponseEntity.ok(ApiResponse.success("商品下架成功", null));
    }

    /** 商品上架 **/
    @PutMapping("/{id}/active")
    public ResponseEntity<ApiResponse<Void>> activeProduct(@PathVariable Long id, HttpSession session) {
        // 可加權限檢查
        productService.unActiveProductByAdmin(id);
        return ResponseEntity.ok(ApiResponse.success("商品上架成功", null));
    }

    /** 取得單一商品詳細 **/
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminProductResponse>> getProductById(@PathVariable Long id, HttpSession session) {
        // 可加權限檢查
        AdminProductResponse product = productService.findProductByIdForAdmin(id);
        return ResponseEntity.ok(ApiResponse.success("取得商品詳細成功", product));
    }
}
