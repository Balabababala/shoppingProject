package com.example.demo.model.entity;


import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;



import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "roles")
public class Role {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;
	
	@Column(name = "name",nullable = false)
	private String name;
	
	@Column(name = "description" ,columnDefinition = "text")
	private String description;
	
	@CreationTimestamp
	@Column(name = "created_at" ,updatable = false)
	private LocalDateTime createdAt= LocalDateTime.now();;
	
	@OneToMany(mappedBy = "role")
	private List<User> users;
}
