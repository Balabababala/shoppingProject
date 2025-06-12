package com.example.demo.service.Impl;

import com.example.demo.exception.ShoppingException;
import com.example.demo.model.dto.ProductImageDto;
import com.example.demo.model.entity.Product;
import com.example.demo.model.entity.ProductImage;
import com.example.demo.repository.ProductImageRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.service.ProductImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;
@Service
public class ProductImageServiceImpl implements ProductImageService {

    @Autowired
    private ProductImageRepository productImageRepository;
    @Autowired
    private ProductRepository productRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    /**
     * 取得商品所有圖片（賣家限定）
     */
    @Override
    public List<ProductImageDto> getImagesByProduct(Long productId, Long sellerId) {
        Product product = productRepository.findBySellerIdAndProductIdWithSellerAndCategoryAndProductImage(sellerId, productId)
                .orElseThrow(() -> new ShoppingException("找不到該商品或非該賣家"));
        return product.getProductImages().stream().map(this::toDto).toList();
    }

    /**
     * 新增主圖（number 設為 -1 表示主圖）
     */
    @Override
    public void addThumbnailToProduct(Long productId, Long sellerId, MultipartFile file) {
        addImageToProduct(productId, sellerId, file, -1);
    }

    /**
     * 新增額外圖（number 設為順序編號）
     */
    @Override
    public void addExtraImageToProduct(Long productId, Long sellerId, MultipartFile file, Integer number) {
        addImageToProduct(productId, sellerId, file, number);
    }

    /**
     * 新增圖片到商品（包含檔案上傳與資料庫記錄） 是上面2個的實作方法
     */
    private void addImageToProduct(Long productId, Long sellerId, MultipartFile file, Integer number) {
    	// 檔案型態檢查（只接受圖片）
        if (!file.getContentType().startsWith("image/")) {
            throw new ShoppingException("只允許上傳圖片格式");
        }

        // 檔案大小限制（例如 5MB）
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new ShoppingException("圖片檔案過大，限制為5MB以內");
        }
    	
        Product product = productRepository.findBySellerIdAndProductIdWithSellerAndCategoryAndProductImage(sellerId, productId)
                .orElseThrow(() -> new ShoppingException("找不到該商品或非該賣家"));

        // 上傳圖片並取得 url
        String url = uploadImageAndGetUrl(file);

        // 新增圖片實體
        ProductImage image = new ProductImage();
        image.setProduct(product);
        image.setNumber(number);
        image.setImageUrl(url);
        System.out.print(url+"HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH");
        productImageRepository.save(image);
    }

    /**
     * 新增多張圖片並標示主圖
     * @param productId 商品ID
     * @param sellerId 賣家ID
     * @param files 圖片檔案清單
     * @param mainImageIndex 主圖在files中的索引（-1~files.size()-1）
     */
    
    public void addImagesToProduct(Long productId, Long sellerId, List<MultipartFile> files, Integer mainImageIndex) {
        if (files == null || files.isEmpty()) {
            throw new IllegalArgumentException("請至少上傳一張圖片");
        }
        if (mainImageIndex < 0 || mainImageIndex >= files.size()) {
            throw new IllegalArgumentException("主圖索引不合法");
        }
        // 限制最大檔案數 10（1主圖 + 最多9附圖）
        if (files.size() > 10) {
            throw new IllegalArgumentException("最多只能上傳10張圖片");
        }

        // 依序處理每張圖片
        int attachmentNumber = 0; // 附圖序號，從0開始
        for (int i = 0; i < files.size(); i++) {
            int number = (i == mainImageIndex) ? -1 : attachmentNumber++;
            MultipartFile file = files.get(i);
            addImageToProduct(productId, sellerId, file, number);
        }
    }
    
    /**
     * 刪除圖片（檢查賣家權限）
     */
    @Override
    public void deleteImage(Long imageId, Long sellerId) {
        ProductImage image = productImageRepository.findById(imageId)
                .orElseThrow(() -> new ShoppingException("找不到該圖片"));
        if (!image.getProduct().getSeller().getId().equals(sellerId)) {
            throw new ShoppingException("無權限刪除圖片");
        }
        productImageRepository.delete(image);
    }

    /**
     * 實際檔案上傳並回傳 URL
     */
    private String uploadImageAndGetUrl(MultipartFile file) {
        try {
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filepath = Paths.get(uploadDir).resolve(filename);
            Files.copy(file.getInputStream(), filepath, StandardCopyOption.REPLACE_EXISTING);
            // 這裡的 URL 實作依專案需求調整
            return "/uploads/" + filename;
        } catch (IOException e) {
            throw new ShoppingException("圖片上傳失敗");
        }
    }

    /**
     * 轉換圖片實體為 DTO
     */
    private ProductImageDto toDto(ProductImage image) {
        ProductImageDto dto = new ProductImageDto();
        dto.setId(image.getId());
        dto.setImageUrl(image.getImageUrl());
        dto.setNumber(image.getNumber());
        return dto;
    }
}

