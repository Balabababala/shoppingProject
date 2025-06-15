package com.example.demo.service.Impl;

import com.example.demo.exception.ShoppingException;
import com.example.demo.mapper.ProductImageMapper;
import com.example.demo.mapper.ProductMapper;
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
        return product.getProductImages().stream()
        								 .map(ProductImageMapper::toDto)
        								 .toList();
    }

    

    /**
     * 新增圖片到商品（包含檔案上傳與資料庫記錄） 
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
        productImageRepository.save(image);
    }

    /**
     * 新增多張圖片並標示主圖
     * @param productId 商品ID
     * @param sellerId 賣家ID
     * @param files 圖片檔案清單
     * @param mainImageIndex 主圖在files中的索引（0~files.size()-1） 這裡才處裡 主圖是-1
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
        int attachmentNumber = 0; // 附圖序號，從0開始 這裡才處裡 主圖改-1 才丟進去
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
    public void deleteImage(Long productId, Long sellerId) {
    	Product product = productRepository.findBySellerIdAndProductIdWithSellerAndCategoryAndProductImage(sellerId,productId).orElseThrow(()-> new ShoppingException("找不到產品 或不是該商品主人"));
    			
        List <ProductImage> productImages = product.getProductImages();

        //該商品沒有圖片可刪除
        if (productImages == null || productImages.isEmpty()) {
            return;
        }
        
        // 刪除本地檔案
        // 刪除資料庫紀錄
        for(ProductImage productImage :productImages) {
        	deleteImageFile(productImage.getImageUrl());
        	productImageRepository.delete(productImage);
        } 
    }

    /**
     * 刪除本地實體圖片檔案
     */
    private void deleteImageFile(String imageUrl) {
        try {
            // 假設 imageUrl 格式是 "/uploads/xxx.jpg"
            String filename = Paths.get(imageUrl).getFileName().toString();
            Path filePath = Paths.get(uploadDir).resolve(filename);

            if (Files.exists(filePath)) {
                Files.delete(filePath);
            }
        } catch (IOException e) {
            // 這裡你可以改用 logger 記錄錯誤
            System.err.println("刪除圖片檔案失敗: " + e.getMessage());
        }
    }




    /**
     * 實際檔案上傳並回傳 URL
     */
    private String uploadImageAndGetUrl(MultipartFile file) {
        try {
            // 取得原始檔名的附檔名（包含點號）
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String filename = UUID.randomUUID().toString() + extension;
            Path filepath = Paths.get(uploadDir).resolve(filename);
            Files.copy(file.getInputStream(), filepath, StandardCopyOption.REPLACE_EXISTING);

            // 回傳 URL
            return "/uploads/" + filename;
        } catch (IOException e) {
            throw new ShoppingException("圖片上傳失敗");
        }
    }


    
}

