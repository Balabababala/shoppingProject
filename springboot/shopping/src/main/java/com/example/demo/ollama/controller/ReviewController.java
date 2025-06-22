package com.example.demo.ollama.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.ollama.dto.ReviewResult;
import com.example.demo.ollama.service.ReviewService;
import com.example.demo.response.ApiResponse;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @PostMapping("/review-all")
    public ResponseEntity<ApiResponse<List<ReviewResult>>> reviewAllComments() {
        List<ReviewResult> results = reviewService.reviewAllComments();
        return ResponseEntity.ok(ApiResponse.success("所有評論已審核", results));
    }
}