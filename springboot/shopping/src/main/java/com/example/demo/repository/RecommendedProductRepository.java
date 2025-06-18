package com.example.demo.repository;

import com.example.demo.model.entity.RecommendedProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface RecommendedProductRepository extends JpaRepository<RecommendedProduct, Long> {

    @Transactional(readOnly = true)
    @Query("SELECT rp FROM RecommendedProduct rp LEFT JOIN FETCH rp.user JOIN FETCH rp.product JOIN FETCH rp.rule")
    List<RecommendedProduct> findAllWithRelations();

    @Transactional(readOnly = true)
    @Query("SELECT rp FROM RecommendedProduct rp " +
           "JOIN FETCH rp.product p " +
           "LEFT JOIN FETCH p.category c " +
           "LEFT JOIN FETCH p.productImages pi " +
           "LEFT JOIN FETCH p.seller s " +
           "WHERE rp.active = true " +
           "ORDER BY rp.score DESC")
    List<RecommendedProduct> findByActiveTrueOrderByScoreDesc();

    @Transactional(readOnly = true)
    @Query("SELECT rp FROM RecommendedProduct rp " +
           "JOIN FETCH rp.product p " +
           "LEFT JOIN FETCH p.category c " +
           "LEFT JOIN FETCH p.productImages pi " +
           "LEFT JOIN FETCH p.seller s " +
           "WHERE rp.user.id = :userId AND rp.active = true " +
           "ORDER BY rp.score DESC")
    List<RecommendedProduct> findByUserIdAndActiveTrueOrderByScoreDesc(Long userId);

    @Transactional(readOnly = true)
    @Query("SELECT rp FROM RecommendedProduct rp " +
           "JOIN FETCH rp.product p " +
           "LEFT JOIN FETCH p.category c " +
           "LEFT JOIN FETCH p.productImages pi " +
           "LEFT JOIN FETCH p.seller s " +
           "WHERE rp.user IS NULL AND rp.active = true " +
           "ORDER BY rp.score DESC")
    List<RecommendedProduct> findByUserIsNullAndActiveTrueOrderByScoreDesc();
}