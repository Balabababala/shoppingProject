package com.example.demo.controller.admin;




import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.dto.AdminRecentlyViewedDto;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.admin.AdminRecentlyViewedService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/history/browse")
public class AdminBrowseHistoryController {

	@Autowired
    private AdminRecentlyViewedService adminrecentlyViewedService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminRecentlyViewedDto>>>  getBrowseHistory() {
        return ResponseEntity.ok(ApiResponse.success("取得瀏覽資料成功", adminrecentlyViewedService.getAllRecentlyViewed()));
    }
}
