package com.example.demo.repository;

import java.sql.ResultSet;
import java.sql.SQLException;


import org.springframework.jdbc.core.RowMapper;
import com.example.demo.model.entity.User;

public class UserRowMapper implements RowMapper<User> {
	
    @Override
    public User mapRow(ResultSet rs, int rowNum) throws SQLException {
        User user = new User();
        user.setId(rs.getInt("id"));
        user.setUsername(rs.getString("username"));
        user.setHashPassword(rs.getString("hash_password"));
        user.setHashSalt(rs.getString("hash_salt"));
        user.setEmail(rs.getString("email"));
        user.setRoleId(rs.getInt("role_id"));

        // datetime 轉換成 LocalDateTime
        user.setCreatedAt(rs.getTimestamp("created_at") != null ? 
                          rs.getTimestamp("created_at").toLocalDateTime() : null);

        user.setUpdatedAt(rs.getTimestamp("updated_at") != null ? 
                          rs.getTimestamp("updated_at").toLocalDateTime() : null);

        user.setLastLoginAt(rs.getTimestamp("last_login_at") != null ? 
                            rs.getTimestamp("last_login_at").toLocalDateTime() : null);

        user.setIsActive(rs.getBoolean("is_active"));
        user.setCompleted(rs.getBoolean("completed"));
        return user;
    }
}
