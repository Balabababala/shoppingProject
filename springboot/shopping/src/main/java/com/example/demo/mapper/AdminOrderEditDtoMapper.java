package com.example.demo.mapper;

import com.example.demo.model.dto.AdminOrderEditDto;
import com.example.demo.model.entity.Order;
import com.example.demo.model.enums.OrderStatus;
import com.example.demo.model.enums.PaymentStatus;
import com.example.demo.model.enums.ShipmentStatus;

public class AdminOrderEditDtoMapper {

    public static AdminOrderEditDto toDto(Order order) {
        if (order == null) return null;

        AdminOrderEditDto dto = new AdminOrderEditDto();
        dto.setId(order.getId());
        dto.setOrderNumber(String.format("ORD-%06d", order.getId()));
        dto.setOrderDate(order.getOrderDate());
        dto.setOrderStatus(order.getOrderStatus().name());
        dto.setPaymentStatus(order.getPaymentStatus().name());
        dto.setShipmentStatus(order.getShipmentStatus().name());

        dto.setShippingMethod(order.getShippingMethod());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setTrackingNumber(order.getTrackingNumber());
        dto.setReceiverName(order.getReceiverName());
        dto.setReceiverPhone(order.getReceiverPhone());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setNotes(order.getNotes());

        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());

        if (order.getBuyer() != null) {
            dto.setBuyerId(order.getBuyer().getId());
            dto.setBuyerName(order.getBuyer().getUsername());
        }
        if (order.getSeller() != null) {
            dto.setSellerId(order.getSeller().getId());
            dto.setSellerName(order.getSeller().getUsername());
        }

        return dto;
    }

    // 若你需要從 DTO 更新 Order 實體的部分資料，可加上這個方法
    public static void updateEntityFromDto(Order order, AdminOrderEditDto adminOrderEditDto) {
        if (order == null || adminOrderEditDto == null) return;

        order.setOrderStatus(OrderStatus.valueOf(adminOrderEditDto.getOrderStatus()));
        order.setPaymentStatus(PaymentStatus.valueOf(adminOrderEditDto.getPaymentStatus()));
        order.setShipmentStatus(ShipmentStatus.valueOf(adminOrderEditDto.getShipmentStatus()));

        order.setShippingMethod(adminOrderEditDto.getShippingMethod());
        order.setPaymentMethod(adminOrderEditDto.getPaymentMethod());
        order.setTrackingNumber(adminOrderEditDto.getTrackingNumber());
        order.setReceiverName(adminOrderEditDto.getReceiverName());
        order.setReceiverPhone(adminOrderEditDto.getReceiverPhone());
        order.setShippingAddress(adminOrderEditDto.getShippingAddress());
        order.setNotes(adminOrderEditDto.getNotes());

        // 如果你允許編輯金額（通常不會），也可以更新 totalAmount
        // order.setTotalAmount(dto.getTotalAmount());
    }
}
