package com.example.demo.controller;

import com.example.demo.model.dto.SellerProductCreateRequest;
import com.example.demo.model.dto.SellerProductResponse;
import com.example.demo.model.dto.UserDto;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.ProductService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/seller/products")
public class SellerProductController {

    @Autowired
    private ProductService productService;

    /**
     * 取得該賣家所有商品
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<SellerProductResponse>>> getSellerProducts(HttpSession session) {
        UserDto userDto = (UserDto) session.getAttribute("userDto");
        List <SellerProductResponse> SellerProductResponses = productService.getSellerProduct(userDto.getUserId());
        return ResponseEntity.ok(ApiResponse.success("取得賣家所有商品成功", SellerProductResponses));
    }

    /**
     * 新增商品（支援多圖上傳）
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Void>> addProduct(@ModelAttribute SellerProductCreateRequest sellerProductDto, HttpSession session) {
    	if (sellerProductDto.getThumbnail() != null) {
            System.out.println("主圖名稱：" + sellerProductDto.getThumbnail().getOriginalFilename());
        }
        if (sellerProductDto.getExtraImages() != null) {
        	sellerProductDto.getExtraImages().forEach(file -> 
                System.out.println("其他圖名稱：" + file.getOriginalFilename()));
        }
    	productService.addProduct(sellerProductDto, session);
        return ResponseEntity.ok(ApiResponse.success("新增成功", null));
    }

    /**
     * 修改商品資料（json 格式）
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> updateProduct(@PathVariable Long id,
                                                           @RequestBody SellerProductCreateRequest dto,
                                                           HttpSession session) {
        productService.updateProduct(dto, id, session);
        return ResponseEntity.ok(ApiResponse.success("修改成功", null));
    }

    /**
     * 刪除商品（軟刪除，標記為已刪除）
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id, HttpSession session) {
        productService.deleteProduct(id, session);
        return ResponseEntity.ok(ApiResponse.success("刪除成功", null));
    }

    /**
     * 商品下架（狀態設為非上架）
     */
    @DeleteMapping("/{id}/unactive")
    public ResponseEntity<ApiResponse<Void>> unActiveProduct(@PathVariable Long id, HttpSession session) {
        productService.unActiveProduct(id, session);
        return ResponseEntity.ok(ApiResponse.success("下架成功", null));
    }

    /**
     * 商品上架（狀態設為上架）
     */
    @PutMapping("/{id}/active")
    public ResponseEntity<ApiResponse<Void>> activeProduct(@PathVariable Long id, HttpSession session) {
        productService.activeProduct(id, session);
        return ResponseEntity.ok(ApiResponse.success("上架成功", null));
    }

    /**
     * 取得單一商品詳細資料（賣家限定）
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SellerProductResponse>> getProductById(@PathVariable Long id, HttpSession session) {
    	SellerProductResponse SellerProductResponse = productService.findProductByIdToSellerProductDto(id, session);
        return ResponseEntity.ok(ApiResponse.success("取得單一商品詳細資料成功", SellerProductResponse));
    }
}

