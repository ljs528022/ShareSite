package com.lec.spring.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class FileUploadService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    public List<String> saveFiles(List<MultipartFile> files) throws IOException {
        List<String> savedFilePaths = new ArrayList<>();

        for (MultipartFile file : files) {
            if(!file.isEmpty()) {
                String originFilename = file.getOriginalFilename();
                String ext = originFilename.substring(originFilename.lastIndexOf("."));
                String uniqueName = UUID.randomUUID().toString() + ext;
                String fullPath = uploadDir + "/" + uniqueName;

                File dir = new File(uploadDir);
                if(!dir.exists()) dir.mkdir();

                file.transferTo(new File(fullPath));
                savedFilePaths.add("/static/item-images/" + uniqueName);
            }
        }

        return savedFilePaths;
    }
}
