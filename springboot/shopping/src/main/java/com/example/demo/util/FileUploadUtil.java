package com.example.demo.util;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

public class FileUploadUtil {

    public static String saveFile(String uploadDir, MultipartFile file) throws IOException {
        // 檔名改用 UUID 保險
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String newFileName = UUID.randomUUID().toString() + fileExtension;

        // 建立目錄
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // 真正儲存檔案
        try {
            Path filePath = uploadPath.resolve(newFileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            return newFileName; // 回傳檔名 (或你可以組完整路徑)
        } catch (IOException e) {
            throw new IOException("無法儲存檔案: " + newFileName, e);
        }
    }
}
