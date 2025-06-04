package com.example.demo.mapper;
import com.example.demo.model.dto.FavoriteDto;
import com.example.demo.model.entity.Favorite;


public class FavoriteMapper {

	public static FavoriteDto toDto(Favorite favorite) {
		String imageUrl = "";
        if (favorite.getProduct().getProductImages() != null && !favorite.getProduct().getProductImages().isEmpty()) {
            imageUrl = favorite.getProduct().getProductImages().get(0).getImageUrl();
        }
		
        return new FavoriteDto(
                favorite.getProduct().getId(),
                favorite.getProduct().getName(),
                favorite.getProduct().getPrice(),
                imageUrl,
                favorite.getProduct().getCategory().getName(),
                favorite.getProduct().getStatus()
            );
    }
}
