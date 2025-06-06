package com.example.demo.model.entity;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "username", nullable = false, length = 50)
    private String username;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "salt", nullable = false)
    private String salt;

    @Column(name = "email", nullable = false, length = 100)
    private String email;


    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
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
    
    @ManyToOne
    @JoinColumn(name = "role_id" ,nullable = false)
    private Role role;
    
    @OneToMany(mappedBy = "seller")
    private List<Product> products;
    
    @OneToMany(mappedBy = "user")
    private List<CartItem> cartItems;
    
    @OneToMany(mappedBy = "user")
    private List<Favorite> favorites;
    
    @OneToMany(mappedBy = "user")
    private List<Notification> notifications;
    
}
