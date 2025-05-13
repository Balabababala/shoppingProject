package com.example.demo.repository;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.example.demo.dto.LoginDTO;

@Component
public class LoginRowMap implements RowMapper<LoginDTO>{

	@Override
	public LoginDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
		LoginDTO loginDTO =new LoginDTO();
		loginDTO.setUsername(rs.getString("username"));
		loginDTO.setPassword(rs.getString("hash_password"));
	    loginDTO.setCaptchaCode(null);
        return loginDTO;
	}

}

