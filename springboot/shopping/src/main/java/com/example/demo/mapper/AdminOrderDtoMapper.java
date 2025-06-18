package com.example.demo.mapper;



import com.example.demo.model.dto.AdminOrderDto;
import com.example.demo.model.entity.Order;


public class AdminOrderDtoMapper {
    public static AdminOrderDto toDto(Order order) {
        AdminOrderDto dto = new AdminOrderDto();
        dto.setId(order.getId());

        // 這裡假設訂單編號就是 id 字串，如果你有訂單編號欄位，也可以換成 order.getOrderNumber()
        dto.setOrderNumber(String.format("ORD-%06d", order.getId())); 

        dto.setBuyerName(order.getBuyer().getUsername());
        dto.setSellerName(order.getSeller().getUsername());
        dto.setOrderDate(order.getOrderDate());
        dto.setOrderStatus(order.getOrderStatus().name()); // Enum 轉 String
        dto.setTotalAmount(order.getTotalAmount());
        
        return dto;
    }
}
