package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.query.Param;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.model.dto.ProductImageDto;
import com.example.demo.model.entity.ProductImage;


public interface ProductImageService {
	
	//邏輯
	
	List<ProductImageDto> getImagesByProduct(Long productId, Long sellerId);									//查該產品圖片 (確認圖片狀態 來決定是否可新增 刪除)
	void addThumbnailToProduct(Long productId, Long sellerId, MultipartFile file);								//新增產品主圖
	void addExtraImageToProduct(Long productId, Long sellerId, MultipartFile file, Integer number); 			//新增產品主圖
	void addImagesToProduct(Long productId, Long sellerId, List<MultipartFile> files, Integer mainImageIndex) ; //整合上面2種的方法
	void deleteImage(Long imageId, Long sellerId);																//刪除該產品圖片
	
}
