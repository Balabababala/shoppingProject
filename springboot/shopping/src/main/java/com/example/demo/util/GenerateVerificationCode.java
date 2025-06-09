package com.example.demo.util;

import java.util.Random;

public class GenerateVerificationCode {
	public static String generateVerificationCode() {
	    // 簡單 6 位英數亂數，你也可以改更安全版
	    int length = 6;
	    String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	    StringBuilder sb = new StringBuilder();
	    Random random = new Random();
	    for (int i = 0; i < length; i++) {
	        sb.append(chars.charAt(random.nextInt(chars.length())));
	    }
	    return sb.toString();
	}
}
