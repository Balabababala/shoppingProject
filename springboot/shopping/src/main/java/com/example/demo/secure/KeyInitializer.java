package com.example.demo.secure;

import com.example.demo.security.KeyUtil;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.security.KeyPair;

//產生JWT key 
@Component
public class KeyInitializer {

    public KeyPair keyPair;

    @PostConstruct
    public void init() {
        try {
            keyPair = KeyUtil.generateRSAKeyPair();
            System.out.println("✅ KeyPair generated successfully.");
        } catch (Exception e) {
            System.err.println("❌ Failed to generate KeyPair: " + e.getMessage());
            throw new RuntimeException("Key initialization failed", e);
        }
    }
    
    public KeyPair getKeyPair() {
        return keyPair;
    }
}
