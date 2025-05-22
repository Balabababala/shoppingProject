package com.example.demo.controller;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Random;

import javax.imageio.ImageIO;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@RestController //免@ResponseBody ,用了 jsp渲染就不能用 
@RequestMapping("/api")


public class AuthcodeController {
	
	@GetMapping("/auth-code")
	public void getAuthCode(HttpSession session, HttpServletResponse response) throws IOException {
	    String code = generateAuthCode(); // 1. 產生驗證碼
	    session.setAttribute("authCode", code); // 2. 存入 session
	    BufferedImage image = getAuthCodeImage(code); // 3. 產生圖像
	    response.setContentType("image/png"); // 4. 設定回傳格式
	    ImageIO.write(image, "png", response.getOutputStream()); // 5. 寫入輸出流
	}
	
	@PostMapping("/verify-code")
	public String verifyCode(@RequestParam String codeInput, HttpSession session) {
	    String savedCode = (String) session.getAttribute("authCode");

	    if (savedCode != null && savedCode.equalsIgnoreCase(codeInput)) {
	        session.removeAttribute("authCode"); // 驗證通過後清除
	        return "驗證成功";
	    } else {
	        return "驗證失敗";
	    }
	}
	
	private String generateAuthCode() {
		String chars="0";
//		String chars="0123456789zxcvbnmasdfghjklqwertyuiopZXCVBNMASDFHJKLQWERTYUIOP";
		Random random= new Random();
		StringBuffer authcode=new StringBuffer();
		for(int i =0 ;i<4;i++) {
			int index = random.nextInt(chars.length()); // 隨機取位置
			authcode.append(chars.charAt(index)); // 取得該位置的資料
		}
		
		return authcode.toString();
	}
	
	private String generateAuthCode2() {
		String chars="0";
		Random random= new Random();
		StringBuffer authcode=new StringBuffer();
		for(int i =0 ;i<4;i++) {
			int index = random.nextInt(chars.length()); // 隨機取位置
			authcode.append(chars.charAt(index)); // 取得該位置的資料
		}
		
		return authcode.toString();
	}
	//use Java2D 產生動態圖像
	private BufferedImage getAuthCodeImage(String authcode) {
		//建立圖像區域(80*30 RGB)
		BufferedImage img =new BufferedImage(80, 30, BufferedImage.TYPE_INT_RGB);
		Graphics g=img.getGraphics();
		//設定顏色
		g.setColor(Color.YELLOW);
		//塗滿
		g.fillRect(0, 0, 80, 30);
		
		g.setColor(Color.BLACK);
		//字型
		g.setFont(new Font("Arial",Font.BOLD,22));
		//繪文字
		g.drawString(authcode,18,22);//(18 x,22 y)表 繪文字坐上起點
		
		g.setColor(Color.RED);
		//干擾線
		Random random =new Random();
		for(int i=0;i<10;i++) {
			int x1=random.nextInt(80);
			int y1=random.nextInt(30);
			int x2=random.nextInt(80);
			int y2=random.nextInt(30);
			//畫直線
			g.drawLine(x1, y1, x2, y2);
		}
		return img;
			
		
	}
}
