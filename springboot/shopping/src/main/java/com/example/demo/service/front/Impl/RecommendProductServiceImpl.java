package com.example.demo.service.front.Impl;



import com.example.demo.mapper.ProductMapper;
import com.example.demo.model.dto.ProductResponse;
import com.example.demo.model.entity.RecommendRule;
import com.example.demo.model.entity.RecommendedProduct;
import com.example.demo.model.enums.ProductStatus;
import com.example.demo.repository.RecommendRuleRepository;
import com.example.demo.repository.RecommendedProductRepository;
import com.example.demo.service.front.RecommendProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecommendProductServiceImpl implements RecommendProductService {

    @Autowired
    private RecommendedProductRepository recommendedProductRepository;
    
    @Autowired
    private RecommendRuleRepository recommendRuleRepository;

    @Override
    public List<ProductResponse> getRecommendedProducts(Long userId) {
        List<RecommendRule> activeRules = recommendRuleRepository.findByActiveTrueOrderByWeightDesc();

        List<RecommendedProduct> recommendedProducts = List.of();

        if (userId != null ) {
            // 優先個人化
            recommendedProducts = recommendedProductRepository
                    .findByUserIdAndActiveTrueOrderByScoreDesc(userId);
        }

        if ((recommendedProducts == null || recommendedProducts.isEmpty()) ) {
            // 通用推薦作為備案
            recommendedProducts = recommendedProductRepository
                    .findByUserIsNullAndActiveTrueOrderByScoreDesc();
        }

        return recommendedProducts.stream()
                .map(RecommendedProduct::getProduct)
                .filter(product -> product != null
                        && !product.getIsDeleted()
                        && product.getStatus() == ProductStatus.ACTIVE)
                .map(ProductMapper::toDto)
                .toList();
    }


}