package com.example.demo.service;


import java.util.List;
import java.util.Optional;

import com.example.demo.model.dto.FavoriteDto;
import com.example.demo.model.entity.Favorite;


public interface FavoriteService {
	//邏輯
	
	
	void addFavoriteByUserIdAndProductId(Long userId, Long productId);				//加入收藏
	void deleteFavoriteByUserIdAndProductId(Long userId,Long productId);			//刪除收藏
	List<FavoriteDto>  findFavoriteByUserId (Long userId);							//查詢使用者收藏狀態
	Optional<Favorite> findByUserIdAndProductId(Long userId ,Long productId);		//判斷是否存在
	
}
