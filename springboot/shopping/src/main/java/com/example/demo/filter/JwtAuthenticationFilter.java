package com.example.demo.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.demo.secure.KeyInitializer;
import com.example.demo.secure.CustomUserDetails;
import com.example.demo.exception.ShoppingException;
import com.example.demo.model.entity.User;
import com.example.demo.repository.UserRepository;

import java.io.IOException;
import java.security.Key;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private KeyInitializer keyInitializer;
    
    @Autowired
    private UserRepository userRepository;

  

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain)
            throws ServletException, IOException {
        logger.debug("開始處理 JWT 過濾器，請求路徑: {}", request.getRequestURI());
        String authHeader = request.getHeader("Authorization");
        logger.debug("收到 Authorization 頭: {}", authHeader != null ? authHeader : "null");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.debug("無效的 Authorization 頭，繼續過濾器鏈");
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        logger.debug("解析的 JWT token: {}", token);

        try {
            if (keyInitializer.getKeyPair() == null) {
                logger.error("KeyInitializer.keyPair 為 null");
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write("伺服器錯誤：金鑰對未初始化");
                return;
            }
            Key publicKey = keyInitializer.getKeyPair().getPublic();
            logger.debug("使用公鑰驗證 token");

            
            // 解析 JWT
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(publicKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String userIdStr  = claims.getSubject();
            Long userId = Long.parseLong(userIdStr);


            if (userIdStr != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                User user = userRepository.findByIdWithRole(userId)
                        .orElseThrow(() -> new ShoppingException("用戶不存在: " + userId));
                logger.debug("找到用戶: {}", user.getUsername());

                CustomUserDetails userDetails = new CustomUserDetails(user);
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                logger.debug("設置 SecurityContext 認證: {}", userId);
            }
            filterChain.doFilter(request, response);
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            logger.error("JWT 已過期: {}", e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("JWT 已過期");
        } catch (io.jsonwebtoken.MalformedJwtException e) {
            logger.error("JWT 格式錯誤: {}", e.getMessage());
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("JWT 格式無效");
        } catch (io.jsonwebtoken.JwtException e) {
            logger.error("JWT 驗證失敗: {}", e.getMessage(), e);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("無效的 JWT Token: " + e.getMessage());
        } catch (ShoppingException e) {
            logger.error("用戶查詢失敗: {}", e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("用戶不存在: " + e.getMessage());
        } catch (Exception e) {
            logger.error("未預期的錯誤在 JWT 過濾器: {}", e.getMessage(), e);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("伺服器錯誤: " + e.getMessage());
        }
    }
}