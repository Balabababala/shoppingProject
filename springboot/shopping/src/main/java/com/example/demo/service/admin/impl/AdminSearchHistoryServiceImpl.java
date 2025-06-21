package com.example.demo.service.admin.impl;

import com.example.demo.mapper.SearchHistoryMapper;
import com.example.demo.model.dto.SearchHistoryDto;
import com.example.demo.model.entity.SearchHistory;
import com.example.demo.model.entity.User;
import com.example.demo.repository.SearchHistoryRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.admin.AdminSearchHistoryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminSearchHistoryServiceImpl implements AdminSearchHistoryService {

	@Autowired
    private SearchHistoryRepository searchHistoryRepository;
	
	@Autowired
    private UserRepository userRepository;

  

    @Override
    public List<SearchHistoryDto> getAllSearchHistories() {
        List<SearchHistory> searchHistories = searchHistoryRepository.findAll();

        return searchHistories.stream()
                .map(searchHistory -> {
                    User user = userRepository.findById(searchHistory.getUserId()).orElse(null);
                    return SearchHistoryMapper.toDto(searchHistory, user);
                })
                .toList();
    }
}
