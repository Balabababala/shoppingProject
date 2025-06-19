package com.example.demo.model.dto;



import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AdminRecentlyViewedDto {
    private Long id;
    private String username;
    private String productName;
    private LocalDateTime viewedAt;

   
}
