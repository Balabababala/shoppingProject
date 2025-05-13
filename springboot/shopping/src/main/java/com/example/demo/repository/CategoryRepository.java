package com.example.demo.repository;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import com.example.demo.model.entity.Categories;

@Repository
public class CategoryRepository {
	
	 @Autowired
	 	private CategoriesRowMap categoriesRowMap;
	 @Autowired
	    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;
	 
	 
	 public List<Categories> findTopCategories() {
	        String sql = "SELECT * FROM categories WHERE parent_id IS NULL";
	        return namedParameterJdbcTemplate.query(sql, new HashMap<>(), new CategoriesRowMap());
	    }
 

}
