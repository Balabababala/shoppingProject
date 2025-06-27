package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.test.context.SpringBootTest;


@SpringBootApplication(exclude = {
	    org.springframework.cloud.function.context.config.ContextFunctionCatalogAutoConfiguration.class
	})
//@SpringBootTest
class ShoppingApplicationTests {

	@Test
	void contextLoads() {
	}

}
