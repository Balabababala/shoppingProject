package com.example.demo.service.admin.impl;



import com.example.demo.mapper.RecommendedProductDtoMapper;
import com.example.demo.model.dto.RecommendedProductDto;
import com.example.demo.model.entity.RecommendedProduct;
import com.example.demo.repository.RecommendedProductRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.RecommendRuleRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.admin.AdminRecommendContentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminRecommendContentServiceImpl implements AdminRecommendContentService {

    @Autowired
    private RecommendedProductRepository recommendedProductRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private RecommendRuleRepository recommendRuleRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<RecommendedProductDto> getAllContents() {
        List<RecommendedProduct> contents = recommendedProductRepository.findAllWithRelations();
        return contents.stream()
        			    .map(RecommendedProductDtoMapper::toDto)
        			    .toList();
    }

    @Override
    public RecommendedProductDto getContentById(Long id) {
        RecommendedProduct content = recommendedProductRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Content not found with id: " + id));
        return RecommendedProductDtoMapper.toDto(content);
    }

    @Override
    public void createContent(RecommendedProductDto contentDto) {
        if (!productRepository.existsById(contentDto.getProductId())) {
            throw new IllegalArgumentException("Product does not exist");
        }
        if (!recommendRuleRepository.existsById(contentDto.getRuleId())) {
            throw new IllegalArgumentException("Rule does not exist");
        }
        if (contentDto.getUserId() != null && !userRepository.existsById(contentDto.getUserId())) {
            throw new IllegalArgumentException("User does not exist");
        }
        if (contentDto.getScore() < 0 || contentDto.getScore() > 1) {
            throw new IllegalArgumentException("Score must be between 0 and 1");
        }
        RecommendedProduct content = RecommendedProductDtoMapper.toEntity(contentDto);
        recommendedProductRepository.save(content);
    }

    @Override
    public void updateContent(Long id, RecommendedProductDto contentDto) {
        RecommendedProduct existingContent = recommendedProductRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Content not found with id: " + id));
        if (!productRepository.existsById(contentDto.getProductId())) {
            throw new IllegalArgumentException("Product does not exist");
        }
        if (!recommendRuleRepository.existsById(contentDto.getRuleId())) {
            throw new IllegalArgumentException("Rule does not exist");
        }
        if (contentDto.getUserId() != null && !userRepository.existsById(contentDto.getUserId())) {
            throw new IllegalArgumentException("User does not exist");
        }
        if (contentDto.getScore() < 0 || contentDto.getScore() > 1) {
            throw new IllegalArgumentException("Score must be between 0 and 1");
        }
        existingContent.setUser(contentDto.getUserId() != null ? RecommendedProductDtoMapper.toEntity(contentDto).getUser() : null);
        existingContent.setProduct(RecommendedProductDtoMapper.toEntity(contentDto).getProduct());
        existingContent.setRule(RecommendedProductDtoMapper.toEntity(contentDto).getRule());
        existingContent.setReason(contentDto.getReason());
        existingContent.setScore(contentDto.getScore());
        existingContent.setActive(contentDto.getActive());
        recommendedProductRepository.save(existingContent);
    }

    @Override
    public void deleteContent(Long id) {
        recommendedProductRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Content not found with id: " + id));
        recommendedProductRepository.deleteById(id);
    }
}