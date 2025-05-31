package com.example.demo.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequest {
    private String receiverName;       // 收件人姓名
    private String receiverPhone;      // 收件人電話
    private String shippingAddress;    // 配送地址
    private String paymentMethod;      // 付款方式
    private String shippingMethod;     // 配送方式
    private String notes;              // 備註（可空）
}
