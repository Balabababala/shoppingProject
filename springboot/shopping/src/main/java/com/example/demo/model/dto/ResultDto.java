package com.example.demo.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
//暫時沒用
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResultDto {
	private boolean success;
	private String message;
}
