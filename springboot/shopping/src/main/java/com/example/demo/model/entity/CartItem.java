package com.example.demo.model.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Table(name = "cart_items")
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Data
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", insertable = false, updatable = false)
    private Long userId;
    
    @Column(name = "product_id", insertable = false, updatable = false)
    private Long productId ;
    
    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "added_at", nullable = false)
    private LocalDateTime addedAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name ="user_id", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name ="product_id", nullable = false)
    private Product product;
}
