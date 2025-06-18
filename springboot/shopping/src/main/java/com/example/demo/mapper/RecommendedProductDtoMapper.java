package com.example.demo.mapper;


import com.example.demo.model.entity.RecommendedProduct;
import com.example.demo.model.entity.User;
import com.example.demo.model.dto.RecommendedProductDto;
import com.example.demo.model.entity.Product;
import com.example.demo.model.entity.RecommendRule;


public class RecommendedProductDtoMapper {

    public static RecommendedProductDto toDto(RecommendedProduct entity) {
        if (entity == null) return null;
        RecommendedProductDto dto = new RecommendedProductDto();
        dto.setId(entity.getId());
        dto.setUserId(entity.getUser() != null ? entity.getUser().getId() : null);
        dto.setUsername(entity.getUser() != null ? entity.getUser().getUsername() : null);
        dto.setProductId(entity.getProduct().getId());
        dto.setProductName(entity.getProduct().getName());
        dto.setRuleId(entity.getRule().getId());
        dto.setRuleName(entity.getRule().getName());
        dto.setReason(entity.getReason());
        dto.setScore(entity.getScore());
        dto.setActive(entity.getActive());
        return dto;
    }

    public static RecommendedProduct toEntity(RecommendedProductDto dto) {
        if (dto == null) return null;
        RecommendedProduct entity = new RecommendedProduct();
        entity.setId(dto.getId());
        if (dto.getUserId() != null) {
            User user = new User();
            user.setId(dto.getUserId());
            entity.setUser(user);
        }
        Product product = new Product();
        product.setId(dto.getProductId());
        entity.setProduct(product);
        RecommendRule rule = new RecommendRule();
        rule.setId(dto.getRuleId());
        entity.setRule(rule);
        entity.setReason(dto.getReason());
        entity.setScore(dto.getScore());
        entity.setActive(dto.getActive());
        return entity;
    }

}