package com.example.demo.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.example.demo.model.enums.ProductStatus;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 假設你的 DB 是自動遞增主鍵
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Min(1)
    @Column(name="stock",nullable = false)
    private Integer  stock;

    @Enumerated(EnumType.STRING)
    @Column(name="status",nullable = false)
    private ProductStatus status ;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne						
    @JoinColumn(name ="category_id")
    private Category category;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name ="seller_id")
    private User seller;
    
    @OneToMany(mappedBy = "product")
    private List<CartItem> cartItems;
    
    @OneToMany(mappedBy = "product")
    private List<Favorite> favorite;
    
    @OneToMany(mappedBy = "product")
    private List<ProductImage> productImages;
    
    @OneToMany(mappedBy = "product")
    private List<RecentlyViewed> recentlyViews;

}
