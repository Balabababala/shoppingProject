package com.example.demo.secure;
import java.security.KeyPair;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.dto.UserDto;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Service
public class JwtService {

	@Autowired
	private KeyInitializer keyInitializer;
	
	public JwtService(KeyInitializer keyInitializer) {
        this.keyInitializer = keyInitializer;
    }

    public String generateJwtToken(UserDto userDto) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .setSubject(userDto.getUsername())
                .claim("userId", userDto.getUserId())
                .claim("role", userDto.getRole())
                .claim("isActive", userDto.getIsActive())
                .claim("isEmailVerified", userDto.getIsEmailVerified())
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + 1000 * 60 * 60 * 24)) // 24小時過期
                .signWith(keyInitializer.keyPair.getPrivate(), SignatureAlgorithm.RS256)
                .compact();
    }
    
}
