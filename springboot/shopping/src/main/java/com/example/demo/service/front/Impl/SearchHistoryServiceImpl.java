package com.example.demo.service.front.Impl;

import java.io.Serial;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.entity.User;
import com.example.demo.repository.SearchHistoryRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.front.SearchHistoryService;
import com.example.demo.model.entity.SearchHistory;

@Service
public class SearchHistoryServiceImpl implements SearchHistoryService{
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private SearchHistoryRepository searchHistoryRepository;
	
	@Override
	public void createSearchHistory(Long id , String keyWord) {
		if(id==null) {
			return;
		}
		Optional<User> user = userRepository.findById(id);
		if(user.isPresent()) {
			SearchHistory searchHistory =new SearchHistory();
			searchHistory.setKeyword(keyWord);
			searchHistory.setUserId(id);
			searchHistory.setSearchedAt(LocalDateTime.now());
			searchHistoryRepository.save(searchHistory);
		}
	}
}
