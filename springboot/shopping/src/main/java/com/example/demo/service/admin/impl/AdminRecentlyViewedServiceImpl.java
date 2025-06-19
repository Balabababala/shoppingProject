package com.example.demo.service.admin.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.mapper.AdminRecentlyViewedMapper;
import com.example.demo.model.dto.AdminRecentlyViewedDto;
import com.example.demo.model.entity.RecentlyViewed;
import com.example.demo.repository.RecentlyViewedRepository;
import com.example.demo.service.admin.AdminRecentlyViewedService;

@Service
public class AdminRecentlyViewedServiceImpl implements AdminRecentlyViewedService{
	
	@Autowired
	private RecentlyViewedRepository recentlyViewedRepository;


	@Override
    public List<AdminRecentlyViewedDto> getAllRecentlyViewed() {
        List<RecentlyViewed> list = recentlyViewedRepository.findAllByOrderByViewedAtDesc();
        return list.stream()
                   .map(AdminRecentlyViewedMapper::toDto)
                   .toList();
    }
	
}
