package com.example.demo.mapper;

import com.example.demo.model.dto.RecommendRuleDto;
import com.example.demo.model.entity.RecommendRule;
import org.springframework.stereotype.Component;



@Component
public class RecommendRuleDtoMapper {

    // 將 RecommendRule 轉為 RecommendRuleDto
    public static RecommendRuleDto toDto(RecommendRule rule) {
        if (rule == null) {
            return null;
        }
        RecommendRuleDto recommendRuleDto = new RecommendRuleDto();
        recommendRuleDto.setId(rule.getId());
        recommendRuleDto.setName(rule.getName());
        recommendRuleDto.setType(rule.getType());
        recommendRuleDto.setWeight(rule.getWeight());
        recommendRuleDto.setActive(rule.getActive());
        return recommendRuleDto;
    }

    // 將 RecommendRuleDto 轉為 RecommendRule
    public static RecommendRule toEntity(RecommendRuleDto recommendRuleDto) {
        if (recommendRuleDto == null) {
            return null;
        }
        RecommendRule rule = new RecommendRule();
        rule.setId(recommendRuleDto.getId());
        rule.setName(recommendRuleDto.getName());
        rule.setType(recommendRuleDto.getType());
        rule.setWeight(recommendRuleDto.getWeight());
        rule.setActive(recommendRuleDto.getActive());
        return rule;
    }
}