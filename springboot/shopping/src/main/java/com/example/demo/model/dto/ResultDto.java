package com.example.demo.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
//暫時沒用
@Data
@AllArgsConstructor
public class ResultDto {
	private boolean success;
	private String message;
}
