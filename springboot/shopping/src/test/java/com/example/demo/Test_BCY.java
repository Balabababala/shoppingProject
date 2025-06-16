package com.example.demo;

import org.junit.jupiter.api.Test;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;



@SpringBootTest
public class Test_BCY {
	
	@Transactional
	@Test
	public void testFindProductsByCategorySlug() {
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
	    String encoded = encoder.encode("1234");
	    System.out.println(encoded);
	    System.out.println(encoded.length()); // 一般是60
	}
}
