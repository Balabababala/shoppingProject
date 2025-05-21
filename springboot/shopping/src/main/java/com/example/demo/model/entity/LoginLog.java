package com.example.demo.model.entity;

import jakarta.persistence.*;
import lombok.Data;


import java.time.LocalDateTime;

@Entity
@Table(name = "login_logs")
@Data
public class LoginLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "user_agent", columnDefinition = "TEXT")
    private String userAgent;

    @Column(name = "login_time", columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime loginTime;

    @Column(name = "success")
    private Boolean success;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Constructors
    public LoginLog() {}

    public LoginLog(User user, String ipAddress, String userAgent, Boolean success) {
        this.user = user;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
        this.success = success;
        this.loginTime = LocalDateTime.now(); // 若 DB 有自動填，也可省略
    }

   
}
