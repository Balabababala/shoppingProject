package com.example.demo.mapper;


import com.example.demo.model.dto.SearchHistoryDto;
import com.example.demo.model.entity.SearchHistory;
import com.example.demo.model.entity.User;

public class SearchHistoryMapper {

    // Entity + User -> DTO
    public static SearchHistoryDto toDto(SearchHistory entity, User user) {
        SearchHistoryDto dto = new SearchHistoryDto();
        dto.setId(entity.getId());
        dto.setKeyword(entity.getKeyword());
        dto.setSearchedAt(entity.getSearchedAt());
        dto.setUsername(user != null ? user.getUsername() : "未知使用者");
        return dto;
    }
}
