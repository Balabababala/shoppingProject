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
    	String prompt = String.format("""
    			請審查下列產品評論是否與產品的使用體驗、品質或服務相關，並判定其是否為有效評論（排除程式碼、純數字、SQL 語法或無意義內容）。

    			評論如下：
    			『%s』

    			請只回傳 JSON 格式結果，格式如下：

    			{
    			  "status": "APPROVED" 或 "REJECTED",
    			  "reason": "使用繁體中文說明為何通過或拒絕",
    			  "sentiment": "POSITIVE"、"NEGATIVE" 或 "NEUTRAL"
    			}

    			✅ 判斷標準：
    			- 如果評論內容是 JSON 格式字串，請判定為 REJECTED，理由為「評論內容非自然語言，疑似系統或程式碼輸入」。
				- 評論可為正面、負面或中立，只要與產品相關，即可視為有效（status: APPROVED）。
				- 「太爛了」、「難用」、「壞掉了」等負面回饋，只要反映產品缺點，應標記為 status: APPROVED 且 sentiment: NEGATIVE。
				- 僅在評論與產品無關、無意義、或為技術語法時，才應設為 status: REJECTED。

    			⚠️ 注意事項：
    			- 請勿回傳文字說明或註解
    			- 請勿換行或加上多餘說明
    			- 僅回傳符合格式的 JSON 字串
    			""", comment);
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