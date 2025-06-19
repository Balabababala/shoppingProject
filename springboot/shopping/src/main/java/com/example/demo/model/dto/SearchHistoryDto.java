package com.example.demo.model.dto;



import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchHistoryDto {

    private Long id;
    private String username;  // 從 userId 轉換過來的名字
    private String keyword;
 
    private LocalDateTime searchedAt;

    
}
