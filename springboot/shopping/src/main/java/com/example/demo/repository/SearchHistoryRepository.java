package com.example.demo.repository;

import com.example.demo.model.entity.SearchHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Long> {
    // 你可以自訂查詢語法或使用 JpaRepository 預設方法
}
