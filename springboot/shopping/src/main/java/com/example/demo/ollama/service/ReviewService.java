package com.example.demo.ollama.service;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.model.entity.ProductReview;
import com.example.demo.ollama.dto.ReviewResult;
import com.example.demo.repository.ProductReviewRepository;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Service
public class ReviewService {
    private static final String OLLAMA_API_URL = "http://localhost:11434/api/generate";
    private static final String MODEL_NAME = "qwen2:7b";

    @Autowired
    private ProductReviewRepository reviewRepository;

    public List<ReviewResult> reviewAllComments() {
        List<ProductReview> reviews = reviewRepository.findByApprovedByAiFalse();
        List<ReviewResult> results = new ArrayList<>();

        for (ProductReview review : reviews) {
            if (review.getComment() != null && !review.getComment().isEmpty()) {
                JSONObject result = reviewComment(review.getComment());
                String status = result.getString("status");
                String reason = result.getString("reason");
                String sentiment = result.getString("sentiment");

                // AI 審核邏輯
                review.setApprovedByAi(true); // 標記 AI 已審核
                review.setIsVisible("APPROVED".equals(status)); // 根據 AI 結果設置是否通過
                review.setUpdatedAt(LocalDateTime.now());
                // 不修改 isApproved，因為這是管理員欄位
                reviewRepository.save(review);

                ReviewResult reviewResult = new ReviewResult();
                reviewResult.setId(review.getId());
                reviewResult.setComment(review.getComment());
                reviewResult.setRating(review.getRating());
                reviewResult.setStatus(status);
                reviewResult.setReason(reason);
                reviewResult.setSentiment(sentiment);
                reviewResult.setUserId(review.getUser().getId());
                reviewResult.setProductId(review.getProduct().getId());
                reviewResult.setIsVisible(review.getIsVisible());
                reviewResult.setApprovedByAi(review.getApprovedByAi());
                reviewResult.setIsApproved(review.getIsApproved());
                results.add(reviewResult);

                System.out.println("評論ID: " + review.getId());
                System.out.println("評論: " + review.getComment());
                System.out.println("狀態: " + status);
                System.out.println("原因: " + reason);
                System.out.println("情感: " + sentiment);
                System.out.println("是否顯示: " + review.getIsVisible());
                System.out.println("AI 審核: " + review.getApprovedByAi());
                System.out.println("管理員審核: " + review.getIsApproved());
                System.out.println("-----------------------------------");
            }
        }
        return results;
    }

    private JSONObject reviewComment(String comment) {
        String prompt = "審核以下產品評論：『" + comment + "』。請確認評論是否與產品的使用體驗、品質或服務相關，且不包含程式碼、純數字、SQL 語法或其他無意義內容。請返回 JSON 格式，包含以下字段：\n" +
                        "- status: 'APPROVED'（評論與產品相關且適當）或 'REJECTED'（無效或不相關）。\n" +
                        "- reason: 具體原因（使用繁體中文，詳細說明為何通過或拒絕）。\n" +
                        "- sentiment: 'POSITIVE'（積極評價，如滿意或推薦）、'NEGATIVE'（負面評價，如不滿或批評）或 'NEUTRAL'（中立評價，無明顯情感或無效內容）。\n" +
                        "範例：\n" +
                        "有效評論：『產品很好用，值得購買！』 -> {'status': 'APPROVED', 'reason': '評論與產品使用體驗相關，內容積極。', 'sentiment': 'POSITIVE'}\n" +
                        "無效評論：『123』 -> {'status': 'REJECTED', 'reason': '評論僅包含數字，無產品相關內容。', 'sentiment': 'NEUTRAL'}\n" +
                        "無效評論：『CREATE TABLE ...』 -> {'status': 'REJECTED', 'reason': '評論包含 SQL 語法，與產品使用體驗無關。', 'sentiment': 'NEUTRAL'}\n" +
                        "注意：評論應反映用戶對產品的真實意見，任何非產品相關內容（如程式碼、技術語法）均應拒絕。";
        JSONObject payload = new JSONObject();
        payload.put("model", MODEL_NAME);
        payload.put("prompt", prompt);
        payload.put("stream", false);

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(OLLAMA_API_URL))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(payload.toString()))
                    .build();
            HttpResponse<String> response = HttpClient.newHttpClient()
                    .send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JSONObject json = new JSONObject(response.body());
                String responseStr = json.getString("response");
                try {
                    return new JSONObject(responseStr);
                } catch (Exception e) {
                    System.err.println("解析 Ollama 回應失敗: " + responseStr);
                    return new JSONObject()
                            .put("status", "ERROR")
                            .put("reason", "AI 回應格式錯誤")
                            .put("sentiment", "UNKNOWN");
                }
            } else {
                System.err.println("Ollama API 失敗，狀態碼: " + response.statusCode());
                return new JSONObject()
                        .put("status", "ERROR")
                        .put("reason", "AI 服務不可用")
                        .put("sentiment", "UNKNOWN");
            }
        } catch (Exception e) {
            System.err.println("Ollama API 錯誤: " + e.getMessage());
            return new JSONObject()
                    .put("status", "ERROR")
                    .put("reason", "審核失敗，請檢查 API 連線")
                    .put("sentiment", "UNKNOWN");
        }
    }
}