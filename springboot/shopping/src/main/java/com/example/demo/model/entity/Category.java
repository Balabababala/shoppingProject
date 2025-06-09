package com.example.demo.model.entity;

import jakarta.persistence.*;


import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    
    @Column(name = "parent_id", insertable = false, updatable = false) // 自己對自己 保留方法
    private Long parentId;
    
    private String slug;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "category")		//對product
    private List<Product> products;
    
    @OneToMany(mappedBy = "parent")			//父對兒(自己對自己)
    private List<Category> children;
    
    @ManyToOne(fetch = FetchType.LAZY)		//兒對父(自己對自己)
    @JoinColumn(name ="parent_id")
    private Category parent;

}
