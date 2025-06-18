package com.example.demo.controller.admin;

import com.example.demo.model.dto.RecommendRuleDto;
import com.example.demo.model.entity.RecommendRule;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.admin.AdminRecommendRuleService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/recommend/rules")
public class AdminRecommendRulesController {

    @Autowired
    private AdminRecommendRuleService adminrecommendRuleService;

    // 獲取所有推薦規則
    @GetMapping
    public ResponseEntity<ApiResponse<List<RecommendRuleDto>>> getAllRules() {
        List<RecommendRuleDto> rules = adminrecommendRuleService.getAllRules();
        return ResponseEntity.ok(ApiResponse.success("獲取規則成功", rules));
    }

    // 獲取單一規則（可選）
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RecommendRuleDto>> getRuleById(@PathVariable Long id) {
    	RecommendRuleDto rule = adminrecommendRuleService.getRuleById(id);
        return ResponseEntity.ok(ApiResponse.success("獲取規則成功", rule));
    }

    // 添加新規則
    @PostMapping
    public ResponseEntity<ApiResponse<Void>> createRule(@RequestBody RecommendRuleDto recommendRuleDto) {
    	adminrecommendRuleService.createRule(recommendRuleDto);
        return ResponseEntity.ok(ApiResponse.success("新增規則成功", null));
    }

    // 更新規則
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RecommendRule>> updateRule(@PathVariable Long id, @RequestBody RecommendRuleDto rule) {
    	adminrecommendRuleService.updateRule(id, rule);
        return ResponseEntity.ok(ApiResponse.success("更新規則成功", null));
    }

    // 刪除規則
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRule(@PathVariable Long id) {
    	adminrecommendRuleService.deleteRule(id);
        return ResponseEntity.ok(ApiResponse.success("刪除成功",null));
    }
}