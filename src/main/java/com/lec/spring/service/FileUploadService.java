package com.lec.spring.service;

import com.lec.spring.domain.ItemImage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileUploadService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    private static final List<String> SUPPORTED_EXTENSIONS = Arrays.asList("jpg", "jpeg", "png", "gif");

    private File ensureDirectoryExists(String path) {
        File dir = new File(path);
        if(!dir.exists()) {
            boolean created = dir.mkdirs();
            if(!created) {
                throw new RuntimeException("디렉토리를 생성할 수 없습니다: " + path);
            }

        }
        return dir; 
    }

    public List<ItemImage> saveItemImages(List<MultipartFile> img, List<Boolean> isMainList) throws IOException {
        List<ItemImage> imageList = new ArrayList<>();

        String itemImageDir = uploadDir + File.separator + "item-images";
        ensureDirectoryExists(itemImageDir);

        for(int i = 0; i < img.size(); i++) {
            MultipartFile file = img.get(i);
            boolean isMain = isMainList != null && i < isMainList.size() ? isMainList.get(i) : false;

            if(!file.isEmpty()) {
                String originFilename = file.getOriginalFilename();
                String ext = originFilename.substring(originFilename.lastIndexOf(".") + 1).toLowerCase();

                if(!SUPPORTED_EXTENSIONS.contains(ext)) {
                    throw new IOException("허용되지 않은 파일 형식입니다!");
                }

                String uniqueName = UUID.randomUUID().toString() + "." + ext;
                String fullPath = itemImageDir + File.separator + uniqueName;

                File dir = new File(uploadDir + "/item-images/");
                if(!dir.exists()) dir.mkdirs();

                file.transferTo(new File(fullPath));

                ItemImage image = ItemImage.builder()
                        .imgUrl("/uploads/item-images/" + uniqueName)
                        .isMain(isMain)
                        .build();

                imageList.add(image);
            }
        }

        return imageList;
    }

    public String saveUserImage(MultipartFile userimg) throws IOException {
        if(userimg.isEmpty()) return null;

        String originFilename = userimg.getOriginalFilename();
        String ext = originFilename.substring(originFilename.lastIndexOf(".") + 1).toLowerCase();

        if(!SUPPORTED_EXTENSIONS.contains(ext)) {
            throw new IOException("허용되지 않은 파일 형식입니다!");
        }

        String uniqueName = UUID.randomUUID().toString() + "." + ext;
        String userImageDir = uploadDir + File.separator + "user-images";
        ensureDirectoryExists(userImageDir);

        String fullPath = userImageDir + File.separator + uniqueName;
        userimg.transferTo(new File(fullPath));

        return "/uploads/user-images/" + uniqueName;
    }

    public void deleteFilesByUrls(List<String> imgUrls) {
        if(imgUrls == null || imgUrls.isEmpty()) return;

        for(String url: imgUrls) {
            try {
                String relativePath = url.startsWith("/") ? url.substring(1) : url;
                Path filePath = Paths.get(uploadDir, relativePath.replace("uploads/", ""));

                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                System.err.println("파일 삭제 실패: " + url);
                e.printStackTrace();
            }
        }
    }
}
