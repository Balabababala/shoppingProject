package com.example.demo.controller.front;


import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;


import javax.imageio.ImageIO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.response.ApiResponse;
import com.example.demo.secure.JwtService;
import com.google.code.kaptcha.Producer;


@RestController
@RequestMapping("/api")
public class AuthcodeController {

	@Autowired
	private Producer captchaProducer;

	@Autowired
	private JwtService jwtService;
	
    private static final Logger logger = LoggerFactory.getLogger(AuthcodeController.class);

//    @GetMapping("/auth-code")
//    public void getAuthCode(HttpSession session, HttpServletResponse response) throws IOException {
//        logger.debug("開始生成驗證碼，session ID: {}", session.getId());
//        String code = generateAuthCode();
//        session.setAttribute("authCode", code);
//        logger.debug("生成驗證碼: {}", code);
//        BufferedImage image = getAuthCodeImage(code);
//        response.setContentType("image/png");
//        try {
//            ImageIO.write(image, "png", response.getOutputStream());
//            logger.debug("驗證碼圖片生成成功");
//        } catch (IOException e) {
//            logger.error("生成驗證碼圖片失敗: {}", e.getMessage(), e);
//            throw e;
//        }
//    }
    
    @GetMapping("/auth-code")
    public ResponseEntity<ApiResponse<Map<String, String>>> getAuthCode() throws IOException {
        String code = captchaProducer.createText();
        String jwtToken = jwtService.generateAuthJwtToken(code);

        BufferedImage image = captchaProducer.createImage(code);

        // 將圖片轉為 Base64 字串
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(image, "png", baos);
        String base64Image = Base64.getEncoder().encodeToString(baos.toByteArray());

        Map<String, String> response = new HashMap<>();
        response.put("token", jwtToken);
        response.put("image", base64Image);

        return ResponseEntity.ok(ApiResponse.success("驗證碼生成成功", response) );
    }


//    @PostMapping("/verify-code")
//    public String verifyCode(@RequestParam String codeInput, HttpSession session) {
//        logger.debug("驗證碼輸入: {}, session ID: {}", codeInput, session.getId());
//        String savedCode = (String) session.getAttribute("authCode");
//        logger.debug("Session 中儲存的驗證碼: {}", savedCode);
//
//        if (savedCode != null && savedCode.equalsIgnoreCase(codeInput)) {
//            session.removeAttribute("authCode");
//            logger.info("驗證碼驗證成功");
//            return "驗證成功";
//        } else {
//            logger.warn("驗證碼驗證失敗，輸入: {}, 預期: {}", codeInput, savedCode);
//            return "驗證失敗";
//        }
//    }
    @PostMapping("/verify-code")
    public ResponseEntity<ApiResponse<String>> verifyCaptcha(
            @RequestParam String userInput,
            @RequestHeader("X-Captcha-Token") String token) {

        try {
        	String code = jwtService.parseCaptchaJwtToken(token);

            if (code != null && code.equalsIgnoreCase(userInput)) {
                return ResponseEntity.ok(ApiResponse.success("驗證成功", token));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error("驗證失敗"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error("驗證失效或錯誤"));
        }
    }


//    private String generateAuthCode() {
//        // 修正字符集，增加隨機性
//        String chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
////    	String chars = "0";
//        Random random = new Random();
//        StringBuilder authcode = new StringBuilder();
//        for (int i = 0; i < 4; i++) {
//            int index = random.nextInt(chars.length());
//            authcode.append(chars.charAt(index));
//        }
//        return authcode.toString();
//    }
//
//    // 移除冗餘的 generateAuthCode2
//    private BufferedImage getAuthCodeImage(String authcode) {
//        BufferedImage img = new BufferedImage(80, 30, BufferedImage.TYPE_INT_RGB);
//        Graphics g = img.getGraphics();
//        g.setColor(Color.YELLOW);
//        g.fillRect(0, 0, 80, 30);
//        g.setColor(Color.BLACK);
//        g.setFont(new Font("Arial", Font.BOLD, 22));
//        g.drawString(authcode, 18, 22);
//
//        g.setColor(Color.RED);
//        Random random = new Random();
//        for (int i = 0; i < 10; i++) {
//            int x1 = random.nextInt(80);
//            int y1 = random.nextInt(30);
//            int x2 = random.nextInt(80);
//            int y2 = random.nextInt(30);
//            g.drawLine(x1, y1, x2, y2);
//        }
//        return img;
//    }
}