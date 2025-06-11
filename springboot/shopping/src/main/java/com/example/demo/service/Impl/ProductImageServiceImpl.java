package com.example.demo.service.Impl;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.exception.ShoppingException;
import com.example.demo.model.dto.ProductImageDto;
import com.example.demo.model.entity.Product;
import com.example.demo.model.entity.ProductImage;
import com.example.demo.repository.ProductImageRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.service.ProductImageService;
import com.example.demo.service.ProductService;

@Service
public class ProductImageServiceImpl implements ProductImageService{
	@Autowired
	private ProductImageRepository productImageRepository;
	
	@Autowired
	private ProductService productService;
	
	@Value("${file.upload-dir}")
    String uploadDir;
	
	//repositroy
	
	
	@Override
	public void deleteByIdAndProductId(Long id, Long productId) {
		productImageRepository.deleteByIdAndProductId(id, productId);
	}

	@Override
	public List<ProductImage> findByProductIdOrderByNumberAscWithProduct(Long productId) {
		return productImageRepository.findByProductIdOrderByNumberAscWithProduct(productId);
	}

	@Override
	public Optional<ProductImage> findByIdAndProductIdWithProduct(Long id, Long productId) {
		return productImageRepository.findByIdAndProductIdWithProduct(id, productId);
	}

	
	
	//邏輯
	
	@Override
	public List<ProductImageDto> getImagesByProduct(Long productId, Long sellerId) {
	    Product product = productService.findBySellerIdAndProductIdWithSellerAndCategoryAndProductImage(sellerId, productId)
	            .orElseThrow(() -> new ShoppingException("找不到該商品或非該賣家"));

	    return product.getProductImages().stream()
	            .map(this::toDto)
	            .toList();
	}


	@Override
	public void addImageToProduct(Long productId, Long sellerId, MultipartFile file, Integer number) {
		// 驗證商品屬於賣家
        Product product = productService.findBySellerIdAndProductIdWithSellerAndCategoryAndProductImage(sellerId, productId)
                .orElseThrow(() -> new ShoppingException("找不到該商品或非該賣家"));

        // 這裡你要自行實作圖片上傳的流程，範例用假設的 url
        String imageUrl = uploadImageAndGetUrl(file);

        ProductImage productImage = new ProductImage();
        productImage.setProduct(product);
        productImage.setNumber(number);
        productImage.setImageUrl(imageUrl);

        ProductImage saved = productImageRepository.save(productImage);
	}

	@Override
	public void deleteImage(Long imageId, Long sellerId) {
		// 先確認圖片與賣家是否對應
        ProductImage image = productImageRepository.findById(imageId)
                .orElseThrow(() -> new ShoppingException("找不到該圖片"));

        if (!image.getProduct().getSeller().getId().equals(sellerId)) {
            throw new ShoppingException("該圖片不屬於賣家");
        }

        productImageRepository.deleteById(imageId);

        // 若圖片存在雲端，別忘了也要刪除雲端上的檔案
        deleteImageFromStorage(image.getImageUrl());
    }

    private ProductImageDto toDto(ProductImage image) {
        ProductImageDto dto = new ProductImageDto();
        dto.setId(image.getId());
        dto.setNumber(image.getNumber());
        dto.setImageUrl(image.getImageUrl());
        dto.setProductId(image.getProduct().getId());
        return dto;
    }

    
    private String uploadImageAndGetUrl(MultipartFile file) {
        // 本地儲存路徑 (可用 application.properties 設定路徑再注入)
    	

        // 產生避免重複的檔名，使用 UUID + 原始副檔名
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String newFileName = UUID.randomUUID().toString() + extension;

        try {
            Path filePath = Paths.get(uploadDir + newFileName);
            Files.createDirectories(filePath.getParent());  // 確保資料夾存在
            file.transferTo(filePath.toFile());              // 儲存檔案
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("上傳圖片失敗");
        }

        // 回傳可被前端存取的URL，假設靜態資源的路徑是 /uploads/
        return "/uploads/" + newFileName;
    }
    private void deleteImageFromStorage(String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) {
            return;
        }

        // 假設 imageUrl 是像 "/uploads/xxx.jpg"，要移除 "/uploads/"
        String fileName = imageUrl.replaceFirst("/uploads/", "");
        Path filePath = Paths.get(uploadDir + fileName);

        try {
            Files.deleteIfExists(filePath);
            System.out.println("已刪除圖片: " + filePath.toString());
        } catch (IOException e) {
            e.printStackTrace();
            // 可以記 log 或丟出例外
            throw new RuntimeException("刪除圖片失敗: " + filePath.toString());
        }
    }

}
