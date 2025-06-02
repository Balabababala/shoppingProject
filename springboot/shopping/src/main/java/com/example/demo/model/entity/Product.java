package com.example.demo.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "products")
@NoArgsConstructor
@AllArgsConstructor
@Data
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

    @Column(nullable = false)
    private Integer stock;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;
    
    @Column(name = "seller_id", insertable = false, updatable = false)
    private Long sellerId;
    
    @Column(name = "category_id", insertable = false, updatable = false)
    private Long categoryId;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne						//對Category
    @JoinColumn(name ="category_id")
    private Category category;
    
    @ManyToOne
    @JoinColumn(name ="seller_id")
    private User seller;
    
    @OneToMany(mappedBy = "product")
    private List<CartItem> cartItems;

}
