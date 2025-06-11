package com.example.demo;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.mapper.CategoryMapper;
import com.example.demo.model.dto.CategoryResponse;
import com.example.demo.model.entity.Category;
import com.example.demo.model.entity.Product;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.util.CategoryTreeUtil;

@SpringBootTest
public class Test_BCY {

	@Autowired
	private CategoryRepository categoryRepository;
	@Autowired
	private ProductRepository productRepository;

	
	@Transactional
	@Test
	public void testFindProductsByCategorySlug() {
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
	    String encoded = encoder.encode("1234");
	    System.out.println(encoded);
	    System.out.println(encoded.length()); // 一般是60
	}
}
