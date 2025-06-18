package com.example.demo.service.admin;

import java.util.List;

import com.example.demo.model.dto.RecommendedProductDto;

/**
 * 管理員推薦內容服務介面，提供對推薦產品的 CRUD 操作。
 */
public interface AdminRecommendContentService {

    /**
     * 獲取所有推薦內容，包括關聯的用戶、產品和規則數據。
     *
     * @return 推薦內容的 DTO 列表，包含用戶名、產品名稱和規則名稱
     */
    List<RecommendedProductDto> getAllContents();

    /**
     * 根據 ID 獲取單個推薦內容。
     *
     * @param id 推薦內容的 ID
     * @return 對應的推薦內容 DTO
     * @throws RuntimeException 如果指定 ID 的推薦內容不存在
     */
    RecommendedProductDto getContentById(Long id);

    /**
     * 新增推薦內容。
     *
     * @param contentDto 推薦內容的 DTO，包含用戶 ID、產品 ID、規則 ID 等
     * @throws IllegalArgumentException 如果提供的用戶 ID、產品 ID 或規則 ID 無效，或分數超出範圍
     */
    void createContent(RecommendedProductDto contentDto);

    /**
     * 更新現有的推薦內容。
     *
     * @param id 推薦內容的 ID
     * @param contentDto 更新後的推薦內容 DTO
     * @throws RuntimeException 如果指定 ID 的推薦內容不存在
     * @throws IllegalArgumentException 如果提供的用戶 ID、產品 ID 或規則 ID 無效，或分數超出範圍
     */
    void updateContent(Long id, RecommendedProductDto contentDto);

    /**
     * 刪除指定 ID 的推薦內容。
     *
     * @param id 推薦內容的 ID
     * @throws RuntimeException 如果指定 ID 的推薦內容不存在
     */
    void deleteContent(Long id);
}