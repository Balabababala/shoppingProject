package com.example.demo.controller;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Categories;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@RestController
@CrossOrigin(origins = "http://localhost:5173")  // 加這行
public class CategoryForNavbar  {

	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;
	
	@GetMapping("/categoriestomynavbar")
	public List<Categories> getcatogory()   {
		
		String sql = "SELECT * FROM categories WHERE parent_id is NULL ;";
		Map<String, Object> map = new HashMap<>();
		
		CategoriesRowMap rowMapper =new CategoriesRowMap();
		
		List<Categories> list=namedParameterJdbcTemplate.query(sql,map,rowMapper);
		
	    return list;
	}
	
	
}
