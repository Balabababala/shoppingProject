package com.example.demo.controller;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.example.demo.model.Categories;

public class CategoriesRowMap implements RowMapper<Categories>{

	@Override
	public Categories mapRow(ResultSet rs, int rowNum) throws SQLException {
		Categories catogories = new Categories();
		catogories.setId(rs.getInt("id"));
		catogories.setName(rs.getString("name"));
		catogories.setParentId(rs.getString("parent_id"));
		catogories.setUpdatedAt(rs.getDate("updated_at"));
		catogories.setCreatedAt(rs.getDate("created_at"));
        return catogories;
	}

}
