package com.example.demo.filter;

import com.example.demo.model.dto.UserDto;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class WebFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // ★★ 一律加 CORS header (不只 OPTIONS)
    	 response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    	 response.setHeader("Access-Control-Allow-Credentials", "true");
    	 response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    	 response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Cache-Control");

        // 放行 CORS 預檢請求 OPTIONS
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        String path = request.getRequestURI();

        // 放行不需登入的路徑
        if (path.startsWith("/api/login") ||
            path.startsWith("/api/logout") ||
            path.startsWith("/api/products") ||
            path.startsWith("/api/categories") ||
            path.startsWith("/api/auth-code") ||
            path.startsWith("/api/register")||
            path.startsWith("/api/verify-email")||
            path.startsWith("/uploads") ||
            path.startsWith("/check")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 判斷是否登入
        HttpSession session = request.getSession(false);
        UserDto userDto = (session != null) ? (UserDto) session.getAttribute("userDto") : null;

        if (userDto == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"success\": false, \"message\": \"尚未登入\"}");
            return;
        }

        // 通過所有檢查，繼續執行後續 Filter 與 Controller
        filterChain.doFilter(request, response);
    }
}
