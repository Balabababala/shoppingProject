package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.entity.LoginLog;

@Repository
public interface LoginLogRepository extends JpaRepository <LoginLog, Long> {

}
