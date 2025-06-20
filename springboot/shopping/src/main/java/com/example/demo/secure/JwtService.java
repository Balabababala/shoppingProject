package com.example.demo.secure;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.dto.UserDto;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Service
public class JwtService {

	@Autowired
	private KeyInitializer keyInitializer;

    public String generateJwtToken(UserDto userDto) {
    	Date now = new Date();
        Date expiryDate = new Date(now.getTime() + 1000 * 60 * 60 * 24); // 24小時
        
        return Jwts.builder()
                .setClaims(buildClaims(userDto))
//              .claim("userId", userDto.getUserId()) 另種放法 
                .setSubject(String.valueOf(userDto.getUserId()))
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(keyInitializer.getKeyPair().getPrivate(), SignatureAlgorithm.RS256)
                .compact();
    }
    
    // ✅ 可放為 private 或 public 根據你是否需要外部使用
    private Map<String, Object> buildClaims(UserDto dto) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", dto.getUserId());
        claims.put("role", dto.getRole());
        claims.put("isActive", dto.getIsActive());
        claims.put("isEmailVerified", dto.getIsEmailVerified());
        return claims;
    }
    
}
