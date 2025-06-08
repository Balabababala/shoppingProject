package com.example.demo.util;

import java.security.MessageDigest;
import java.security.SecureRandom;

import org.springframework.stereotype.Service;

//給login 用的
@Service
public class PasswordHash {
	
	public static String generateSalt() throws Exception{
		SecureRandom random= new SecureRandom();
		byte[] salt =new byte[16];
		random.nextBytes(salt);
		return bytesToHex(salt);
	}
	
	public static String bytesToHex (byte[] bytes) {
		StringBuilder sb =new StringBuilder();
		for(byte b:bytes) {
			sb.append(String.format("%02x", b));
		}
		return sb.toString();	
	}
	
	public static String hashPassword(String password,String salt)throws Exception{
		//SHA-256
		MessageDigest md= MessageDigest.getInstance("SHA-256");
		byte[] hashBytes= md.digest((password+salt).getBytes());
		//將 byte[] 轉 16 Hex
		return bytesToHex(hashBytes);
		
	}
	public static void main(String[] args) throws Exception {
		String password="1234";
		String salt =generateSalt();
		String hash= hashPassword(password,salt);
		System.out.printf("salt: %s length: %d%n",salt,salt.length());
		System.out.printf("password:%s hash: %s length: %s%n",password,hash,hash.length());
	}
}
