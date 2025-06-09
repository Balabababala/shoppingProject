package com.example.demo.service;

import java.util.Optional;

import com.example.demo.model.entity.Role;

public interface RoleService {
	Optional<Role> findByRoleId(Integer roleId);
}
