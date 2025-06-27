package com.example.demo;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class Test_BCY {

    @Test
    public void testBCryptEncode() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String encoded = encoder.encode("1234");
        System.out.println("密碼雜湊: " + encoded);
        System.out.println("長度: " + encoded.length()); // 應該是 60
    }
}
