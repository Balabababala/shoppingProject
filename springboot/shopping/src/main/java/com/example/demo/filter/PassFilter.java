//SpringSecure 配套用的 暫時封印

//package com.example.demo.filter;
//
//import java.io.IOException;
//
//import com.example.demo.model.dto.UserDto;
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import jakarta.servlet.http.HttpSession;
//import org.springframework.web.filter.OncePerRequestFilter;
//
////不能是Servlet(@webfilter) 然後 extend Httpfilter 也不行 他不給chain
//public class PassFilter extends OncePerRequestFilter {
//
//    @Override
//    protected void doFilterInternal(HttpServletRequest request,
//                                    HttpServletResponse response,
//                                    FilterChain filterChain)
//            throws ServletException, IOException {
//
//        String path = request.getRequestURI();
//
//        // 放行不需登入的路徑
//        if (path.startsWith("/api/login") ||
//            path.startsWith("/api/products") ||
//            path.startsWith("/api/categories") ||
//            path.startsWith("/api/auth-code")) {
//            filterChain.doFilter(request, response);
//            return;
//        }
//
//        // 檢查 session 是否有登入資訊
//        HttpSession session = request.getSession(false);
//        UserDto userDto = (session != null) ? (UserDto) session.getAttribute("userDto") : null;
//
//        if (userDto == null) {
//            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//            response.setContentType("application/json;charset=UTF-8");
//            response.getWriter().write("{\"success\": false, \"message\": \"尚未登入\"}");
//            return;
//        }
//
//        // 放行
//        filterChain.doFilter(request, response);
//    }
//}
