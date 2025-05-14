package com.example.demo.repository;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import com.example.demo.model.entity.Category;

@Repository
public class CategoryRepositoryImpl implements CategoryRepository{
	
	 @Autowired
	    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;
	 
	 
	 public List<Category> findAllCategories() {
	        String sql = "SELECT * FROM categories";
	        return namedParameterJdbcTemplate.query(sql, new HashMap<>(), new CategoriesRowMap());
	    }
 

}
