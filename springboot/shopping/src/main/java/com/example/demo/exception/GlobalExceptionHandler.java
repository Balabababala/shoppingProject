package com.example.demo.exception;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.example.demo.response.ApiResponse;

// 利用 @ControllerAdvice 的特性來處理全局錯誤
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ShoppingException.class)
    public ResponseEntity<ApiResponse<Object>> handleShoppingException(ShoppingException e) {
        // 這裡你可以用 404 Not Found，因為通常是「找不到商品」或「找不到資源」的狀況
        ApiResponse<Object> apiResponse = ApiResponse.error(e.getMessage());
        return ResponseEntity.status(404).contentType(MediaType.APPLICATION_JSON).body(apiResponse);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleException(Exception e) {
        String errorMessage = e.toString();
        switch (e.getClass().getSimpleName()) {
            case "MethodArgumentTypeMismatchException": 
                errorMessage = "參數錯誤(" + e.getClass().getSimpleName() + ")";
                return ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON).body(ApiResponse.error(errorMessage));
            case "NoResourceFoundException":
                errorMessage = "查無網頁(" + e.getClass().getSimpleName() + ")";
                return ResponseEntity.status(404).contentType(MediaType.APPLICATION_JSON).body(ApiResponse.error(errorMessage));
            default:
                return ResponseEntity.status(500).contentType(MediaType.APPLICATION_JSON).body(ApiResponse.error("系統錯誤: " + errorMessage));
        }    
    }
}

