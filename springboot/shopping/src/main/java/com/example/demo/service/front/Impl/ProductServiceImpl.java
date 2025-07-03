package com.example.demo.service.front.Impl;

import com.example.demo.exception.ShoppingException;
import com.example.demo.mapper.*;
import com.example.demo.model.dto.AdminProductCreateRequest;
import com.example.demo.model.dto.AdminProductResponse;
import com.example.demo.model.dto.ProductResponse;
import com.example.demo.model.dto.SellerProductCreateRequest;
import com.example.demo.model.dto.SellerProductResponse;
import com.example.demo.model.entity.Category;
import com.example.demo.model.entity.Product;
import com.example.demo.model.entity.User;
import com.example.demo.model.enums.ProductStatus;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.RecentlyViewedRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.front.CategoryService;
import com.example.demo.service.front.ProductImageService;
import com.example.demo.service.front.ProductService;
import com.example.demo.service.front.RecentlyViewedService;
import com.example.demo.service.front.SearchHistoryService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {



    

    @Autowired
    private RecentlyViewedService recentlyViewedService;
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
    @Autowired
    private SearchHistoryService searchHistoryService;



    @Override
    public void addProduct(SellerProductCreateRequest request, Long userId) {
        Product product = productRepository.save(
                SellerProductMapper.toEntity(
                        request,
                        categoryRepository.findById(request.getCategoryId())
                                .orElseThrow(() -> new ShoppingException("無該分類")),
                        userRepository.findById(userId)
                                .orElseThrow(() -> new ShoppingException("無該賣家"))
                )
        );

        List<MultipartFile> allFiles = new ArrayList<>();
        if (request.getThumbnail() != null && !request.getThumbnail().isEmpty()) {
            allFiles.add(request.getThumbnail());
        }
        if (request.getExtraImages() != null) {
            allFiles.addAll(request.getExtraImages().stream().limit(9).toList());
        }

        if (!allFiles.isEmpty()) {
            productImageService.addImagesToProduct(product.getId(), userId, allFiles, 0);
        }
    }

    @Override
    public void updateProduct(SellerProductCreateRequest req, Long id, Long userId) {
        Product product = productRepository.findBySellerIdAndProductIdWithSellerAndCategoryAndProductImage(userId, id)
                .orElseThrow(() -> new ShoppingException("找不到該商品或非該賣家"));

        boolean hasNewImages = (req.getThumbnail() != null && !req.getThumbnail().isEmpty()) ||
                (req.getExtraImages() != null && !req.getExtraImages().isEmpty());

        if (hasNewImages) {
            productImageService.deleteImage(product.getId(), userId);
            product.getProductImages().clear();

            List<MultipartFile> newImages = new ArrayList<>();
            if (req.getThumbnail() != null) newImages.add(req.getThumbnail());
            if (req.getExtraImages() != null) newImages.addAll(req.getExtraImages());

            productImageService.addImagesToProduct(product.getId(), userId, newImages, 0);
        }

        product.setName(req.getName());
        product.setDescription(req.getDescription());
        product.setPrice(req.getPrice());
        product.setStock(req.getStock());
        product.setStatus(req.getStatus());
        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new ShoppingException("無該分類"));
        product.setCategory(category);
        productRepository.save(product);
    }

    @Override
    public void deleteProduct(Long id, Long userId) {
        Product product = productRepository.findBySellerIdAndProductIdWithSellerAndCategoryAndProductImage(userId, id)
                .orElseThrow(() -> new ShoppingException("找不到該商品或非該賣家"));
        product.setIsDeleted(true);
        productRepository.save(product);
    }

    private void updateProductStatus(Long id, Long userId, ProductStatus status) {
        Product product = productRepository.findBySellerIdAndProductIdWithSellerAndCategoryAndProductImage(userId, id)
                .orElseThrow(() -> new ShoppingException("找不到該商品或非該賣家"));
        product.setStatus(status);
        productRepository.save(product);
    }

    @Override
    public void unActiveProduct(Long id, Long userId) {
        updateProductStatus(id, userId, ProductStatus.INACTIVE);
    }

    @Override
    public void activeProduct(Long id, Long userId) {
        updateProductStatus(id, userId, ProductStatus.ACTIVE);
    }

    @Override
    public List<SellerProductResponse> getSellerProduct(Long userId) {
        return productRepository.findBySellerIdWithSellerAndCategoryAndProductImage(userId)
                .stream()
                .filter(p -> !Boolean.TRUE.equals(p.getIsDeleted()))
                .map(SellerProductMapper::toDto)
                .toList();
    }

    @Override
    public SellerProductResponse findProductByIdToSellerProductDto(Long id, Long userId) {
        Product product = productRepository.findBySellerIdAndProductIdWithSellerAndCategoryAndProductImage(userId, id)
                .orElseThrow(() -> new ShoppingException("找不到該商品或非該賣家"));
        return SellerProductMapper.toDto(product);
    }

    @Override
    public ProductResponse findProductByIdToProductResponse(Long id,Long userId) {
    	ProductResponse productResponse =ProductMapper.toDto(productRepository.findByIdWithCategoryAndProductImage(id)
                .orElseThrow(() -> new ShoppingException("查無商品")));
    	
    	if(userId!=null)
    	recentlyViewedService.addRecentlyViewed(userId,id);
    	
        return productResponse;
    }

    @Override
    public List<ProductResponse> findAllProductsToProductResponse() {
        return productRepository.findVisibleWithCategory()
                .stream()
                .map(ProductMapper::toDto)
                .toList();
    }

    @Override
    public List<ProductResponse> findAllProductsByCategorySlugToProductResponses(String slug) {
        List<Long> categoryIds = categoryService.findAllCategoryAndDescendantsBySlug(slug)
                .stream().map(Category::getId).toList();
        return productRepository.findAllByCategoryIdsWithCategoryAndProductImage(categoryIds)
                .stream().map(ProductMapper::toDto).toList();
    }

    @Override
    public List<ProductResponse> findProductsByKeywordFullTextBooleanToProductResponses(Long userId, String keyword) {
    	searchHistoryService.createSearchHistory(userId, keyword);
//        return productRepository.findByKeywordFullTextBoolean(keyword + "*")
//                .stream().map(ProductMapper::toDto).toList();
        return productRepository.findByKeywordFullTextPostgres(keyword)
              		.stream().map(ProductMapper::toDto).toList();
    }

    @Override
    public void minusProductByid(Long id, Integer quantity) {
        if (productRepository.minusByIdIfEnoughStock(id, quantity) == 0) {
            throw new ShoppingException("庫存不足，無法扣除商品庫存，商品ID：" + id);
        }
    }

    // --- Admin 功能不需變動，保留原樣 ---

    @Override
    public List<AdminProductResponse> getAllProductsForAdmin() {
        return productRepository.findAll().stream()
                .map(AdminProductMapper::toDto)
                .toList();
    }

    @Override
    public void addProductByAdmin(@Valid AdminProductCreateRequest adminProductCreateRequest) {
        Category category = categoryRepository.findById(adminProductCreateRequest.getCategoryId())
                .orElseThrow(() -> new ShoppingException("找不到分類 ID：" + adminProductCreateRequest.getCategoryId()));
        User seller = userRepository.findById(adminProductCreateRequest.getSellerId())
                .orElseThrow(() -> new ShoppingException("找不到賣家 ID：" + adminProductCreateRequest.getSellerId()));
        Product product = AdminProductMapper.toEntity(adminProductCreateRequest, category, seller);
        
        product = productRepository.save(product);

        List<MultipartFile> allFiles = new ArrayList<>();
        if (adminProductCreateRequest.getThumbnail() != null && !adminProductCreateRequest.getThumbnail().isEmpty()) {
            allFiles.add(adminProductCreateRequest.getThumbnail());
        }
        if (adminProductCreateRequest.getExtraImages() != null && !adminProductCreateRequest.getExtraImages().isEmpty()) {
            allFiles.addAll(adminProductCreateRequest.getExtraImages().stream().limit(9).toList());
        }

        if (!allFiles.isEmpty()) {
            productImageService.addImagesToProduct(product.getId(), seller.getId(), allFiles, 0);
        }
    }

    @Override
    public void deleteProductByAdmin(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ShoppingException("找不到商品，ID：" + id));
        product.setIsDeleted(true);
        productRepository.save(product);
    }

    @Override
    public void restoreProductByAdmin(Long id) {
        Optional<Product> optional = productRepository.findById(id);
        if (optional.isEmpty()) {
            throw new ShoppingException("找不到商品，ID：" + id);
        }
        Product product = optional.get();
        product.setIsDeleted(false);
        productRepository.save(product);
    }

    @Override
    public void unActiveProductByAdmin(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ShoppingException("找不到商品，ID：" + id));
        product.setStatus(ProductStatus.INACTIVE);
        productRepository.save(product);
    }

    @Override
    public void activeProductByAdmin(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ShoppingException("找不到商品，ID：" + id));
        product.setStatus(ProductStatus.ACTIVE);
        productRepository.save(product);
    }

    @Override
    public AdminProductResponse findProductByIdForAdmin(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ShoppingException("找不到商品，ID：" + id));
        return AdminProductMapper.toDto(product);
    }

    @Override
    public void updateProductByAdmin(Long id, @Valid AdminProductCreateRequest request) {
        Product product = productRepository.findByIdWithSeller(id)
                .orElseThrow(() -> new ShoppingException("找不到商品 ID：" + id));
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ShoppingException("找不到分類 ID：" + request.getCategoryId()));
        User seller = product.getSeller();
        if (seller == null) {
            throw new ShoppingException("該商品沒有關聯賣家，無法更新圖片");
        }

        boolean hasNewImages = (request.getThumbnail() != null && !request.getThumbnail().isEmpty()) ||
                (request.getExtraImages() != null && !request.getExtraImages().isEmpty());

        if (hasNewImages) {
            productImageService.deleteImage(product.getId(), seller.getId());
            product.getProductImages().clear();

            List<MultipartFile> newImages = new ArrayList<>();
            if (request.getThumbnail() != null && !request.getThumbnail().isEmpty()) {
                newImages.add(request.getThumbnail());
            }
            if (request.getExtraImages() != null && !request.getExtraImages().isEmpty()) {
                newImages.addAll(request.getExtraImages());
            }

            productImageService.addImagesToProduct(product.getId(), seller.getId(), newImages, 0);
        }

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setStatus(request.getStatus());
        product.setCategory(category);

        productRepository.save(product);
    }
}
