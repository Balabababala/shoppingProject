package com.example.demo.secure;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.dto.UserDto;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Service
public class JwtService {

	private final String SECRET_KEY = "your-very-secure-secret-key";  // 請換成安全字串
	
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
    
    public String generateAuthJwtToken(String code) {
    	
    	Date now = new Date();
        Date expiryDate = new Date(System.currentTimeMillis() + 60 * 1000); // 1 min
        
        return  Jwts.builder()
				                .setSubject("captcha")
				                .claim("code", code)
				                .setExpiration(expiryDate)
				                .signWith(keyInitializer.getKeyPair().getPrivate(), SignatureAlgorithm.RS256)
				                .compact();
    }
    
    public String parseCaptchaJwtToken(String token) {
    	Key publicKey = keyInitializer.getKeyPair().getPublic();

    	Claims claims = Jwts.parserBuilder()
                .setSigningKey(publicKey)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.get("code", String.class);
    }
   
}
