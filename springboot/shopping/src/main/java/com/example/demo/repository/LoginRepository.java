package com.example.demo.repository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import com.example.demo.dto.LoginDTO;


@Repository
public class LoginRepository {

	 @Autowired
	    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;
	 
	 
	 public List<LoginDTO> findByUsername(String username) {
	        String sql = "SELECT * FROM users WHERE username=:username";
	        Map<String, Object> params = new HashMap<>();
	        params.put("username", username);
	        
	        return namedParameterJdbcTemplate.query(sql, params,new LoginRowMap());
	    }
 

}
