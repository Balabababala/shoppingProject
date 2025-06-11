package com.example.demo.service.Impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.example.demo.model.dto.ProductResponse;
import com.example.demo.model.dto.SellerProductDto;
import com.example.demo.model.dto.UserDto;
import com.example.demo.model.entity.Category;
import com.example.demo.model.entity.Product;
import com.example.demo.model.enums.ProductStatus;
import com.example.demo.repository.ProductRepository;
import com.example.demo.service.CategoryService;
import com.example.demo.service.ProductService;
import com.example.demo.service.UserService;

import jakarta.servlet.http.HttpSession;

import com.example.demo.exception.ShoppingException;
import com.example.demo.mapper.*;

@Service
public class ProductServiceImpl implements ProductService{

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	private UserService userService;
	
	@Autowired
	private CategoryService categoryService;
	
	//repository
	@Override
	public void save(Product product) {
		productRepository.save(product);
	}
	@CacheEvict(value = "products", key = "#id")
	@Override	
	public Integer minusByIdIfEnoughStock(Long id, Integer quantity) {
		return productRepository.minusByIdIfEnoughStock(id, quantity);
	}

	@Override
	public List<Product> findBySellerIdWithSellerAndCategoryAndProductImage(Long sellerId) {
		return productRepository.findBySellerIdWithSellerAndCategoryAndProductImage(sellerId);
	}

	@Override
	public Optional<Product> findBySellerIdAndProductIdWithSellerAndCategoryAndProductImage(Long sellerId,
			Long productId) {
		return productRepository.findBySellerIdAndProductIdWithSellerAndCategoryAndProductImage(sellerId, productId);
	}

	@Override
 	public List<Product> findAllProductsWithCategory(){
		return productRepository.findAllWithCategory();
	};
	
	public List<Product> findAllByCategoryIdsWithCategoryAndProductImage (List<Long> categoryIds){
		return productRepository.findAllByCategoryIdsWithCategoryAndProductImage(categoryIds);
	}
	

	@CacheEvict(value = "products", key = "#id")
	@Override
	public	Optional<Product> findByIdWithCategoryAndProductImage(Long id){
		return productRepository.findByIdWithCategoryAndProductImage(id);
	}

	@Cacheable(value = "products", key = "#id")
	@Override
	public Optional<Product> findById(Long id) {
		return productRepository.findById(id);
	}


	@Override
	public List<Product> findByCategoryId(Long categoryId) {
		return productRepository.findByCategoryId(categoryId);
	}


	@Override
	public List<Product> findByKeywordFullTextBoolean(String keyword) {
		return productRepository.findByKeywordFullTextBoolean(keyword);
	}

	//邏輯
	@Override
	public void addProduct(SellerProductDto sellerProductDto,HttpSession session) {
		UserDto userDto=(UserDto)session.getAttribute("userDto");
		save(SellerProductMapper.toEntity(sellerProductDto
										,categoryService.findById(sellerProductDto.getCategoryId()).orElseThrow(()-> new ShoppingException("無該分類")) 
										,userService.findById(userDto.getUserId()).orElseThrow(()-> new ShoppingException("無該賣家"))));
	}
	
	
	@Override
	public void updataProduct(SellerProductDto sellerProductDto, Long productId, HttpSession session) {
		UserDto userDto=(UserDto)session.getAttribute("userDto");
		Product product = findBySellerIdAndProductIdWithSellerAndCategoryAndProductImage(userDto.getUserId(), productId)
															.orElseThrow(() -> new ShoppingException("找不到該商品或非該賣家"));
		// 更新欄位
	    product.setName(sellerProductDto.getName());
	    product.setDescription(sellerProductDto.getDescription());
	    product.setPrice(sellerProductDto.getPrice());
	    product.setStock(sellerProductDto.getStock());
	    product.setStatus(sellerProductDto.getStatus());
	    
	    // 更新分類，要先抓出 Category Entity
	    Category category = categoryService.findById(sellerProductDto.getCategoryId())
	            .orElseThrow(() -> new ShoppingException("無該分類"));
	    product.setCategory(category);
		save(product);
	}
	
	@Override
	public void deleteProduct(Long productId, HttpSession session) {
		UserDto userDto=(UserDto)session.getAttribute("userDto");
		Product product = findBySellerIdAndProductIdWithSellerAndCategoryAndProductImage(userDto.getUserId(), productId)
															.orElseThrow(() -> new ShoppingException("找不到該商品或非該賣家"));
		// 更新欄位
		product.setIsDeleted(true);
		save(product);
	}
	
	
	@Override
	public void unActiveProduct(Long productId, HttpSession session) {
		UserDto userDto=(UserDto)session.getAttribute("userDto");
		Product product = findBySellerIdAndProductIdWithSellerAndCategoryAndProductImage(userDto.getUserId(), productId)
															.orElseThrow(() -> new ShoppingException("找不到該商品或非該賣家"));
		// 更新欄位
		product.setStatus(ProductStatus.INACTIVE);
		save(product);
	}
	@Override
	public void activeProduct(Long productId, HttpSession session) {
		UserDto userDto=(UserDto)session.getAttribute("userDto");
		Product product = findBySellerIdAndProductIdWithSellerAndCategoryAndProductImage(userDto.getUserId(), productId)
															.orElseThrow(() -> new ShoppingException("找不到該商品或非該賣家"));
		// 更新欄位
		product.setStatus(ProductStatus.ACTIVE);
		save(product);
	}
	@Override
	public void minusProductByid(Long id, Integer quantity) {
		Integer updatedRows=minusByIdIfEnoughStock(id, quantity);
		if (updatedRows == 0) {
	        throw new ShoppingException("庫存不足，無法扣除商品庫存，商品ID：" + id);
	    }
	}
	
	
	@Override
	public SellerProductDto findProductByIdToSellerProductDto(Long productId,HttpSession session) {
		UserDto userDto=(UserDto)session.getAttribute("userDto");
		Product product = findBySellerIdAndProductIdWithSellerAndCategoryAndProductImage(userDto.getUserId(), productId)
															.orElseThrow(() -> new ShoppingException("找不到該商品或非該賣家"));

		return SellerProductMapper.toDto(product);
	}
	
	@Override
	public ProductResponse findProductByIdToProductResponse(Long id) {
		return ProductMapper.toDto(findByIdWithCategoryAndProductImage(id).orElseThrow(()-> new ShoppingException("product 轉 dto 失敗")));
	}
	
	@Override
	public List<ProductResponse> findAllProductsToProductResponse() {
//		 return categoryRepository.findAll().stream()
//		        .flatMap(category -> 
//	            productRepository.findByCategoryId(category.getId()).stream()
//	                .map(ProductMapper::toDto)
//	        )
//	        .toList();
		
		return findAllProductsWithCategory().stream()
											.map(ProductMapper::toDto)
				                            .toList();
	}

	@Override
	public List<ProductResponse> findAllProductsByCategorySlugToProductResponses(String slug) {  	//自己+子子孫孫
		// 取得分類與所有子孫分類
	    List<Category> categories = categoryService.findAllCategoryAndDescendantsBySlug(slug);
	    List<Long> categoryIds = categories.stream()
	                                       .map(Category::getId)
	                                       .toList();
	    // 一次查詢所有符合 categoryIds 的商品
	    List<Product> products = findAllByCategoryIdsWithCategoryAndProductImage(categoryIds);

	    // 轉 DTO 回傳
	    return products.stream()
	                   .map(ProductMapper::toDto)
	                   .toList();
	}
	
	@Override 
	public List<ProductResponse> findProductsByKeywordFullTextBooleanToProductResponses(String keyword) {//boolean 狀態才能 用*萬用字元
		keyword=keyword+'*';
		return productRepository.findByKeywordFullTextBoolean(keyword).stream()
																.map(ProductMapper::toDto)
																.toList();
	}
}
