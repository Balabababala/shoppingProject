package com.example.demo.controller.admin;



import com.example.demo.model.dto.AdminOrderEditDto;
import com.example.demo.model.dto.SearchHistoryDto;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.admin.AdminSearchHistoryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/search-history")
public class AdminSearchHistoryController {

	@Autowired
    private AdminSearchHistoryService adminsearchHistoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SearchHistoryDto>>> getAllSearchHistories() {
        List<SearchHistoryDto> list = adminsearchHistoryService.getAllSearchHistories();
        return ResponseEntity.ok(ApiResponse.success("取得搜尋資料成功", list));
    }
}
