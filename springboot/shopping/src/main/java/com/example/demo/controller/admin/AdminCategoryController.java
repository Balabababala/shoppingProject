package com.example.demo.controller.admin;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.dto.AdminCategoryDto;
import com.example.demo.model.entity.Category;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.front.CategoryService;


@RestController
@RequestMapping("/api/admin/categories")
public class AdminCategoryController {

	@Autowired
	private CategoryService categoryService;


    // 取得所有分類列表 (後台用)
    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminCategoryDto>>> getAllCategories() {
        List<AdminCategoryDto> list = categoryService.findAll();
        return ResponseEntity.ok(ApiResponse.success("成功", list));
    }

    // 新增分類
    @PostMapping
    public ResponseEntity<ApiResponse<AdminCategoryDto>> createCategory(@Valid @RequestBody AdminCategoryDto adminCategoryDto) {
    	AdminCategoryDto created = categoryService.create(adminCategoryDto);
        return ResponseEntity.ok(ApiResponse.success("成功", created));
    }

    // 修改分類
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody AdminCategoryDto adminCategoryDto) {
        categoryService.update(id, adminCategoryDto);
        return ResponseEntity.ok(ApiResponse.success("修改分類成功",null));
    }

    // 刪除分類
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("刪除分類成功",null));
    }
}
