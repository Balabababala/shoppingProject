package com.example.demo.model.entity;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "username", nullable = false, length = 50)
    private String username;

    @Column(name = "hash_password", nullable = false)
    private String hashPassword;

    @Column(name = "hash_salt", nullable = false)
    private String hashSalt;

    @Column(name = "email", nullable = false, length = 100)
    private String email;

    @Column(name = "role_id", nullable = false)
    private Long roleId;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "is_email_verified", nullable = false)
    private Boolean isEmailVerified;
    
    @Column(name = "default_address", columnDefinition = "TEXT")
    private String defaultAddress;

    @Column(name = "default_receiver_name", length = 255)
    private String defaultReceiverName;

    @Column(name = "default_receiver_phone", length = 50)
    private String defaultReceiverPhone;
    
    
    
    
    @OneToMany(mappedBy = "seller")
    private List<Product> products;
    
    @OneToMany(mappedBy = "user")
    private List<CartItem> cartItems;
}
