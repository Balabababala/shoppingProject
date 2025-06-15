package com.example.demo.service.Impl;

import com.example.demo.service.ProductReviewService;


import com.example.demo.model.dto.ProductReviewDto;
import com.example.demo.model.entity.ProductReview;
import com.example.demo.model.entity.User;
import com.example.demo.model.entity.Product;
import com.example.demo.repository.ProductReviewRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.ProductRepository;

import com.example.demo.mapper.ProductReviewMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional
public class ProductReviewServiceImpl implements ProductReviewService {

	@Autowired
    private  ProductReviewRepository productReviewRepository;
    
	@Autowired
    private  UserRepository userRepository;
    
	@Autowired
    private  ProductRepository productRepository;

    @Override
    public ProductReviewDto addReview(Long userId, Long productId, int rating, String comment) {
        User user = userRepository.findById(userId).orElseThrow(() -> new NoSuchElementException("找不到使用者"));
        Product product = productRepository.findById(productId).orElseThrow(() -> new NoSuchElementException("找不到產品"));

        // 防止同一用戶重複評論同產品 (可選，依需求調整)
        if (productReviewRepository.existsByUserAndProduct(user, product)) {
            throw new IllegalStateException("已經評論過此商品");
        }

        ProductReview review = new ProductReview();
        review.setUser(user);
        review.setProduct(product);
        review.setRating(rating);
        review.setComment(comment);
        review.setIsVisible(false);  // 預設未顯示，需管理員審核
        review.setIsApproved(false);

        ProductReview saved = productReviewRepository.save(review);
        return ProductReviewMapper.toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductReviewDto> getReviewsByProduct(Long productId) {
        return productReviewRepository.findByProductIdAndIsVisibleTrue(productId)
                         .stream()
                         .map(ProductReviewMapper::toDto)
                         .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductReviewDto> getReviewsByUser(Long userId) {
        return productReviewRepository.findByUserId(userId)
                         .stream()
                         .map(ProductReviewMapper::toDto)
                         .toList();
    }

    @Override
    public ProductReviewDto updateVisibility(Long reviewId, boolean visible) {
        ProductReview review = productReviewRepository.findById(reviewId)
            .orElseThrow(() -> new NoSuchElementException("找不到評論"));
        review.setIsVisible(visible);
        ProductReview updated = productReviewRepository.save(review);
        return ProductReviewMapper.toDto(updated);
    }

    @Override
    public ProductReviewDto approveReview(Long reviewId, boolean approved) {
        ProductReview review = productReviewRepository.findById(reviewId)
            .orElseThrow(() -> new NoSuchElementException("找不到評論"));
        review.setIsApproved(approved);
        // 可能同時設定 visible = true (視系統流程)
        if (approved) review.setIsVisible(true);
        ProductReview updated = productReviewRepository.save(review);
        return ProductReviewMapper.toDto(updated);
    }

    @Override
    public void deleteReview(Long reviewId) {
        if (!productReviewRepository.existsById(reviewId)) {
            throw new NoSuchElementException("找不到評論");
        }
        productRepository.deleteById(reviewId);
    }
}
