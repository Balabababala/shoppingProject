package com.example.demo.service.admin;



import com.example.demo.model.dto.SearchHistoryDto;
import java.util.List;

public interface AdminSearchHistoryService {
    List<SearchHistoryDto> getAllSearchHistories();
}
