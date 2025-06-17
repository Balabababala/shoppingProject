package com.example.demo.service.front;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.query.Param;

import com.example.demo.model.dto.AdminCategoryDto;
import com.example.demo.model.dto.CategoryResponse;
import com.example.demo.model.entity.Category;



public interface CategoryService {

	//邏輯
	List <CategoryResponse> findTopCategory();											//navbar 用的 只顯示最上層 分類
	List <CategoryResponse> findLeafCategories();										//找 沒有子分類的分類
//	CategoryResponse findCategoryBySlug(String slug);									//用 slug 找  		   轉DTO
	List<CategoryResponse> findCategoryChildrenBySlugToCategoryResponse(String slug);	//用 slug 找 全部(含子分類) 轉DTO
	List<Category> findAllCategoryAndDescendantsBySlug(String slug);					//用 slug 找	全部 		   但不轉DTO
	
	 // 後台用 - AdminCategoryDto 相關 CRUD
	List<AdminCategoryDto> findAll();//取得所有後台用的商品分類 DTO 清單
    Optional<AdminCategoryDto> findById(Long id);//根據分類 ID 查詢商品分類 DTO
    AdminCategoryDto create(AdminCategoryDto dto);//新增一筆商品分類
    AdminCategoryDto update(Long id, AdminCategoryDto dto);//更新指定 ID 的商品分類資料
    void deleteById(Long id);//根據 ID 刪除指定的商品分類
}
