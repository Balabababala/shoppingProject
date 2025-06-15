package com.example.demo.service.Impl;

import com.example.demo.exception.ShoppingException;
import com.example.demo.mapper.ProductMapper;
import com.example.demo.mapper.SellerProductMapper;
import com.example.demo.model.dto.ProductResponse;
import com.example.demo.model.dto.SellerProductCreateRequest;
import com.example.demo.model.dto.SellerProductResponse;
import com.example.demo.model.dto.UserDto;
import com.example.demo.model.entity.Category;
import com.example.demo.model.entity.Product;
import com.example.demo.model.enums.ProductStatus;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.ProductImageRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.CategoryService;
import com.example.demo.service.ProductImageService;
import com.example.demo.service.ProductService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CategoryRepository categoryRepository;
   
    @Autowired
    private ProductImageService productImageService;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CategoryService categoryService;

    /**
     * 新增商品並上傳圖片（1主圖 + 最多9張額外圖）
     */
    @Override
    public void addProduct(SellerProductCreateRequest sellerProductDto, HttpSession session) {
        UserDto userDto = (UserDto) session.getAttribute("userDto");

        // 先存商品資料
        Product product = productRepository.save(
                SellerProductMapper.toEntity(
                		sellerProductDto,
                        categoryRepository.findById(sellerProductDto.getCategoryId())
                                .orElseThrow(() -> new ShoppingException("無該分類")),
                        userRepository.findById(userDto.getUserId())
                                .orElseThrow(() -> new ShoppingException("無該賣家"))
                )
        );

        // 準備圖片列表：主圖放第一張，後面接最多9張額外圖
        List<MultipartFile> allFiles = new ArrayList<>();
        if (sellerProductDto.getThumbnail() != null && !sellerProductDto.getThumbnail().isEmpty()) {
            allFiles.add(sellerProductDto.getThumbnail());
        }
        if (sellerProductDto.getExtraImages() != null && !sellerProductDto.getExtraImages().isEmpty()) {
            allFiles.addAll(sellerProductDto.getExtraImages().stream().limit(9).toList());
        }

        // 一次呼叫 service 上傳圖片，number 從 0 開始，0 表示主圖
        if (!allFiles.isEmpty()) {
            productImageService.addImagesToProduct(product.getId(), userDto.getUserId(), allFiles, 0);
        }
    }


    /**
     * 修改商品資訊，驗證賣家權限
     */
    @Override
    public void updateProduct(SellerProductCreateRequest sellerProductCreateRequest, Long id, HttpSession session) {
        UserDto userDto = (UserDto) session.getAttribute("userDto");

        // 找商品
        Product product = productRepository.findBySellerIdAndProductIdWithSellerAndCategoryAndProductImage(userDto.getUserId(), id)
            .orElseThrow(() -> new ShoppingException("找不到該商品或非該賣家"));
        
        	MultipartFile thumbnail = sellerProductCreateRequest.getThumbnail();
        	List <MultipartFile> extraImages =sellerProductCreateRequest.getExtraImages();
        	
        	boolean hasNewImages = (thumbnail != null && !thumbnail.isEmpty()) ||
                (extraImages != null && !extraImages.isEmpty());
        	
        	if(hasNewImages) {
	        	// 刪除舊圖片（資料庫）
        		
	            productImageService.deleteImage(product.getId(),userDto.getUserId());
	            product.getProductImages().clear();
	
	            // 加入新圖片
	            List<MultipartFile> newImages = new ArrayList();
	            if(sellerProductCreateRequest.getThumbnail()!=null) {
	            	 newImages.add(sellerProductCreateRequest.getThumbnail());
	            }
	            if(sellerProductCreateRequest.getExtraImages()!=null) {
	            	newImages.addAll(sellerProductCreateRequest.getExtraImages());
	            }
	            
	            productImageService.addImagesToProduct(product.getId(), userDto.getUserId(), newImages, 0);
        	}		
		
			 // 更新其他欄位（你原本的邏輯）
            product.setName(sellerProductCreateRequest.getName());
            product.setDescription(sellerProductCreateRequest.getDescription());
            product.setPrice(sellerProductCreateRequest.getPrice());
            product.setStock(sellerProductCreateRequest.getStock());
            product.setStatus(sellerProductCreateRequest.getStatus());

            Category category = categoryRepository.findById(sellerProductCreateRequest.getCategoryId())
                    .orElseThrow(() -> new ShoppingException("無該分類"));
            product.setCategory(category);
            // 儲存
            productRepository.save(product);
    }

    /**
     * 軟刪除商品，標記為已刪除
     */
    @Override
    public void deleteProduct(Long id, HttpSession session) {
        UserDto user = (UserDto) session.getAttribute("userDto");
        Product product = productRepository.findBySellerIdAndProductIdWithSellerAndCategoryAndProductImage(user.getUserId(), id)
                .orElseThrow(() -> new ShoppingException("找不到該商品或非該賣家"));
        product.setIsDeleted(true);
        productRepository.save(product);
    }

    /**
     * 商品下架（狀態設為 INACTIVE）
     */
    @Override
    public void unActiveProduct(Long id, HttpSession session) {
        updateProductStatus(id, session, ProductStatus.INACTIVE);
    }

    /**
     * 商品上架（狀態設為 ACTIVE）
     */
    @Override
    public void activeProduct(Long id, HttpSession session) {
        updateProductStatus(id, session, ProductStatus.ACTIVE);
    }

    /**
     * 共用狀態修改方法
     */
    private void updateProductStatus(Long id, HttpSession session, ProductStatus status) {
        UserDto user = (UserDto) session.getAttribute("userDto");
        Product product = productRepository.findBySellerIdAndProductIdWithSellerAndCategoryAndProductImage(user.getUserId(), id)
                .orElseThrow(() -> new ShoppingException("找不到該商品或非該賣家"));
        product.setStatus(status);
        productRepository.save(product);
    }

    /**
     * 取得賣家所有商品清單
     */
    @Override
    public List<SellerProductResponse> getSellerProduct(Long userId) {
        return productRepository.findBySellerIdWithSellerAndCategoryAndProductImage(userId)
                .stream()
                .filter(p -> !Boolean.TRUE.equals(p.getIsDeleted()))
                .map(SellerProductMapper::toDto)
                .toList();
    }

    /**
     * 取得單一商品（賣家限定）
     */
    @Override
    public SellerProductResponse findProductByIdToSellerProductDto(Long id, HttpSession session) {
        UserDto user = (UserDto) session.getAttribute("userDto");
        Product product = productRepository.findBySellerIdAndProductIdWithSellerAndCategoryAndProductImage(user.getUserId(), id)
                .orElseThrow(() -> new ShoppingException("找不到該商品或非該賣家"));
        return SellerProductMapper.toDto(product);
    }

    /**
     * 取得單一商品詳細資料（給前台用）
     */
    @Override
    public ProductResponse findProductByIdToProductResponse(Long id) {
        return ProductMapper.toDto(productRepository.findByIdWithCategoryAndProductImage(id)
                .orElseThrow(() -> new ShoppingException("查無商品")));
    }

    /**
     * 取得所有商品（前台）
     */
    @Override
    public List<ProductResponse> findAllProductsToProductResponse() {
        return productRepository.findVisibleWithCategory()
                .stream()
                .map(ProductMapper::toDto)
                .toList();
    }

    /**
     * 依分類 Slug 取得該分類與所有子分類商品
     */
    @Override
    public List<ProductResponse> findAllProductsByCategorySlugToProductResponses(String slug) {
        List<Long> categoryIds = categoryService.findAllCategoryAndDescendantsBySlug(slug)
                .stream().map(Category::getId).toList();
        return productRepository.findAllByCategoryIdsWithCategoryAndProductImage(categoryIds)
                .stream().map(ProductMapper::toDto).toList();
    }

    /**
     * 依關鍵字全文搜尋商品（Boolean 模式）
     */
    @Override
    public List<ProductResponse> findProductsByKeywordFullTextBooleanToProductResponses(String keyword) {
        return productRepository.findByKeywordFullTextBoolean(keyword + "*")
                .stream().map(ProductMapper::toDto).toList();
    }

    /**
     * 訂單結帳時扣庫存（有庫存才扣，否則拋例外）
     */
    @Override
    public void minusProductByid(Long id, Integer quantity) {
        if (productRepository.minusByIdIfEnoughStock(id, quantity) == 0) {
            throw new ShoppingException("庫存不足，無法扣除商品庫存，商品ID：" + id);
        }
    }
}

