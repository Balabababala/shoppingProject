package com.example.demo.repository;

import com.example.demo.model.entity.RecommendedProduct;


import lombok.Locked.Read;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface RecommendedProductRepository extends JpaRepository<RecommendedProduct, Long> {

	@Transactional(readOnly = true)
    @Query("SELECT rp FROM RecommendedProduct rp LEFT JOIN FETCH rp.user JOIN FETCH rp.product JOIN FETCH rp.rule")
    List<RecommendedProduct> findAllWithRelations();
}