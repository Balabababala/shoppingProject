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
	void addImagesToProduct(Long productId, Long sellerId, List<MultipartFile> files, Integer mainImageIndex) ; //加List<MultipartFile> 生成名字上傳圖到硬碟 + 到資料庫
	void deleteImage(Long productId, Long sellerId);																//刪除該產品圖片
	
}
