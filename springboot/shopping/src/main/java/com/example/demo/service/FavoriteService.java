package com.example.demo.service;


import java.util.List;
import java.util.Optional;

import com.example.demo.model.dto.FavoriteDto;
import com.example.demo.model.entity.Favorite;


public interface FavoriteService {
	//repository
	
	void save(Favorite favorite);
	void delete(Favorite favorite);
	List<Favorite> findByUserId(Long userId);
	List<Favorite> findByUserIdWithUserAndProductAndImages(Long userId);	//join 版
	Optional<Favorite> findByUserIdAndProductId(Long userId ,Long productId);//給判斷用
	
	//邏輯
	
	void addFavoriteByUserIdAndProductId(Long userId, Long productId);
	void deleteFavoriteByUserIdAndProductId(Long userId,Long productId);
	List<FavoriteDto> findFavoriteByUserId (Long userId);
	
	
}
