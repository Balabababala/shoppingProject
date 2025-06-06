package com.example.demo.service.Impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.exception.ShoppingException;
import com.example.demo.mapper.FavoriteMapper;
import com.example.demo.model.dto.FavoriteDto;
import com.example.demo.model.entity.Favorite;
import com.example.demo.repository.FavoriteRepository;
import com.example.demo.service.FavoriteService;
import com.example.demo.service.ProductService;
import com.example.demo.service.UserService;

@Service
public class FavoriteServiceImpl implements FavoriteService{
	
	@Autowired
	private FavoriteRepository favoriteRepository;
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private ProductService productService;

	//repository
	@Transactional
	@Override
	public void save(Favorite favorite) {
		favoriteRepository.save(favorite);	
	}

	@Override
	public void delete(Favorite favorite) {
		favoriteRepository.delete(favorite);
	}

	@Override
	public List<Favorite> findByUserId(Long userId) {
		return favoriteRepository.findByUserId(userId);
	}
	
	@Override
	public List<Favorite> findByUserIdWithUserAndProductAndImages(Long userId){
		return favoriteRepository.findByUserIdWithUserAndProductAndImages(userId);
	}
	
	@Override
	public Optional<Favorite> findByUserIdAndProductId(Long userId, Long productId) {
		return favoriteRepository.findByUserIdAndProductId(userId, productId);
	}

	//邏輯
	
	
	@Override
	public void addFavoriteByUserIdAndProductId(Long userId, Long productId) {		
		if(!findByUserIdAndProductId(userId,productId).isEmpty()){					//已經存在
			throw new ShoppingException("已加入收藏");
		}
		Favorite favorite =new Favorite();

		favorite.setUser(userService.findUserById(userId));
		favorite.setProduct(productService.findById(productId).get());
		
		save(favorite);
	}

	@Override
	public void deleteFavoriteByUserIdAndProductId(Long userId, Long productId) {
		Optional<Favorite> opt=findByUserIdAndProductId(userId,productId);
		if(opt.isEmpty()){					//已經存在
			throw new ShoppingException("未加入收藏");
		}

		delete(opt.get());
	}

	@Override
	public List<FavoriteDto> findFavoriteByUserId(Long userId) {
		return	findByUserIdWithUserAndProductAndImages(userId).stream().
																map(FavoriteMapper::toDto).
																toList();
	}

	
	
	

}
