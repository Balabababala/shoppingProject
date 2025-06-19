package com.example.demo.service.admin.impl;

import com.example.demo.mapper.SearchHistoryMapper;
import com.example.demo.model.dto.SearchHistoryDto;
import com.example.demo.model.entity.SearchHistory;
import com.example.demo.model.entity.User;
import com.example.demo.repository.SearchHistoryRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.admin.AdminSearchHistoryService;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminSearchHistoryServiceImpl implements AdminSearchHistoryService {

    private final SearchHistoryRepository searchHistoryRepository;
    private final UserRepository userRepository;

    public AdminSearchHistoryServiceImpl(SearchHistoryRepository searchHistoryRepository, UserRepository userRepository) {
        this.searchHistoryRepository = searchHistoryRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<SearchHistoryDto> getAllSearchHistories() {
        List<SearchHistory> entities = searchHistoryRepository.findAll();

        return entities.stream()
                .map(entity -> {
                    User user = userRepository.findById(entity.getUserId()).orElse(null);
                    return SearchHistoryMapper.toDto(entity, user);
                })
                .toList();
    }
}
