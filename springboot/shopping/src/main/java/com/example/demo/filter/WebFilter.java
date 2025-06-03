package com.example.demo.filter;

import java.io.IOException;

import com.example.demo.model.dto.UserDto;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class WebFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // 放行 CORS 預檢請求 OPTIONS，不做認證檢查 
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String path = request.getRequestURI();

        // 放行不需登入的路徑（例如登入、商品查詢等）
        if (path.startsWith("/api/login") ||
            path.startsWith("/api/products") ||
            path.startsWith("/api/categories") ||
            path.startsWith("/api/auth-code")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 從 session 取出使用者資訊判斷是否登入
        HttpSession session = request.getSession(false);
        UserDto userDto = (session != null) ? (UserDto) session.getAttribute("userDto") : null;

        // 若未登入，回傳 401 未授權
        if (userDto == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"success\": false, \"message\": \"尚未登入\"}");
            return;
        }

        // 通過所有檢查，繼續後續 filter 或請求處理
        filterChain.doFilter(request, response);
    }
}


