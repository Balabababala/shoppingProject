package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.query.Param;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.model.dto.ProductImageDto;
import com.example.demo.model.entity.ProductImage;


public interface ProductImageService {
	//repositroy
	void deleteByIdAndProductId(Long id, Long productId);
	List<ProductImage> findByProductIdOrderByNumberAscWithProduct(Long productId);
	Optional<ProductImage> findByIdAndProductIdWithProduct(Long id,Long productId);
	//邏輯
	
	List<ProductImageDto> getImagesByProduct(Long productId, Long sellerId);					//
	void addImageToProduct(Long productId, Long sellerId, MultipartFile file, Integer number);
	void deleteImage(Long imageId, Long sellerId);
	
}
