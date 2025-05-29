package com.example.demo.exception;

public class ShoppingException extends RuntimeException{

	public ShoppingException() {
		super();
	}
	
	public ShoppingException(String message) {
		super(message);
	}
	public ShoppingException(String message, Throwable cause) {
	      super(message, cause);
	 }
}
