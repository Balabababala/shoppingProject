package com.example.demo.service.Impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.exception.ShoppingException;
import com.example.demo.mapper.FavoriteMapper;
import com.example.demo.model.dto.FavoriteDto;
import com.example.demo.model.entity.Favorite;
import com.example.demo.repository.FavoriteRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.FavoriteService;
import com.example.demo.service.ProductService;
import com.example.demo.service.UserService;

@Service
public class FavoriteServiceImpl implements FavoriteService{
	
	@Autowired
	private FavoriteRepository favoriteRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private ProductRepository productRepository;

	

	//邏輯
	
	
	@Override
	public void addFavoriteByUserIdAndProductId(Long userId, Long productId) {		
		if(!favoriteRepository.findByUserIdAndProductId(userId,productId).isEmpty()){					
			throw new ShoppingException("已加入收藏");
		}
		Favorite favorite =new Favorite();

		favorite.setUser(userRepository.findById(userId).orElseThrow(() -> new ShoppingException("找不到使用者")));
		favorite.setProduct(productRepository.findById(productId).orElseThrow(() -> new ShoppingException("找不到產品")));
		
		favoriteRepository.save(favorite);
	}
	
	@Override
	public void deleteFavoriteByUserIdAndProductId(Long userId, Long productId) {
		Optional<Favorite> opt=favoriteRepository.findByUserIdAndProductId(userId,productId);
		if(opt.isEmpty()){							
			throw new ShoppingException("未加入收藏");
		}

		favoriteRepository.delete(opt.get());
	}

	@Override
	public List<FavoriteDto> findFavoriteByUserId(Long userId) {
		return	favoriteRepository.findByUserIdWithUserAndProductAndImages(userId).stream().
																map(FavoriteMapper::toDto).
																toList();
	}

	@Override
	public Optional<Favorite> findByUserIdAndProductId(Long userId, Long productId) {
		return favoriteRepository.findByUserIdAndProductId(userId, productId);
	}

	
}
