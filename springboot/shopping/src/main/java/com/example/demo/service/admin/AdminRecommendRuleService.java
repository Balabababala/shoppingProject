package com.example.demo.service.admin;

import com.example.demo.model.dto.RecommendRuleDto;
import com.example.demo.model.entity.RecommendRule;
import java.util.List;

public interface AdminRecommendRuleService {
	
	
    List<RecommendRuleDto> getAllRules();						//取所有規則
    RecommendRuleDto getRuleById(Long id);						//取特定規則
    void createRule(RecommendRuleDto recommendRuleDto);			//創造規則
    void updateRule(Long id, RecommendRuleDto recommendRuleDto);//更新規則
    void deleteRule(Long id);							  		//刪除規則
    
}