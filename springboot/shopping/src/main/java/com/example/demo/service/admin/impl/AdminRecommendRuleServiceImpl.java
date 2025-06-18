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

    
    @Override
    public List<RecommendRuleDto> getAllRules() {
        return recommendRuleRepository.findAll().stream()
        									    .map(RecommendRuleDtoMapper::toDto)
        									    .toList();
    }

    @Override
    public RecommendRuleDto getRuleById(Long id) {
        return RecommendRuleDtoMapper.toDto(recommendRuleRepository.findById(id)
        														   .orElseThrow(()->new ShoppingException("沒找到規則")));
    }

    @Override
    public void createRule(RecommendRuleDto recommendRuleDto) {
    	recommendRuleRepository.save(RecommendRuleDtoMapper.toEntity(recommendRuleDto));
    }

    @Override
    public void updateRule(Long id, RecommendRuleDto dto) {
        RecommendRule rule = recommendRuleRepository.findById(id)
            .orElseThrow(() -> new ShoppingException("找不到規則"));

        rule.setName(dto.getName());
        rule.setType(dto.getType());
        rule.setWeight(dto.getWeight());
        rule.setActive(dto.getActive());

        recommendRuleRepository.save(rule);
    }

    @Override
    public void deleteRule(Long id) {
        recommendRuleRepository.deleteById(id);
    }
}