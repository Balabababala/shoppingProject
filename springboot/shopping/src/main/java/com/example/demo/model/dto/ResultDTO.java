package com.example.demo.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResultDTO {
	private boolean success;
	private String message;
}
