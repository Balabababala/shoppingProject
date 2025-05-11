package com.example.demo.model.Entity;

import java.sql.Date;

import lombok.Data;

@Data
public class Categories {
	Integer id  ;
	String name ;
    String parentId ;
    Date createdAt ;
    Date updatedAt;

}
