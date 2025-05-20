package com.example.demo.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ApiResponse<T> {
	private String message; // 附加訊息
	T data;					// payload 實體資料
	
	
	public static <T> ApiResponse<T> success(String message, T data){
		return new ApiResponse<T>(message,data);
	}
	public static <T> ApiResponse<T> error(String message){
		return new ApiResponse<T>(message,null);
	}
}
