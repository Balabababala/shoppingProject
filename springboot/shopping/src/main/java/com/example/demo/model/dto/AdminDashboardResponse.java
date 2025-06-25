package com.example.demo.model.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminDashboardResponse {

    private long orderCount;
    private BigDecimal totalSales;

}
