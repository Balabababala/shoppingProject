package com.example.demo.service.admin.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.exception.ShoppingException;
import com.example.demo.mapper.RecommendRuleDtoMapper;
import com.example.demo.model.dto.RecommendRuleDto;
import com.example.demo.model.entity.RecommendRule;
import com.example.demo.repository.RecommendRuleRepository;
import com.example.demo.service.admin.AdminRecommendRuleService;


@Service
public class AdminRecommendRuleServiceImpl implements AdminRecommendRuleService {

	
    @Autowired
    private RecommendRuleRepository recommendRuleRepository;

    public List<RecommendRuleDto> getAllRules() {
        return recommendRuleRepository.findAll().stream()
        									    .map(RecommendRuleDtoMapper::toDto)
        									    .toList()
        							   ;
    }

    public RecommendRuleDto getRuleById(Long id) {
        return RecommendRuleDtoMapper.toDto(recommendRuleRepository.findById(id)
        														   .orElseThrow(()->new ShoppingException("沒找到規則")));
    }

    public void createRule(RecommendRuleDto recommendRuleDto) {
    	recommendRuleRepository.save(RecommendRuleDtoMapper.toEntity(recommendRuleDto));
    }

    public void updateRule(Long id, RecommendRuleDto recommendRuleDto) {
        RecommendRule existingRule = recommendRuleRepository.getById(id);
        recommendRuleRepository.save(RecommendRuleDtoMapper.toEntity(recommendRuleDto));
    }

    public void deleteRule(Long id) {
        recommendRuleRepository.deleteById(id);
    }
}