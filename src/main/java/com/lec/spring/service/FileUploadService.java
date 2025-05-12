package com.lec.spring.service;

import com.lec.spring.domain.ItemImage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileUploadService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    private static final List<String> SUPPORTED_EXTENSIONS = Arrays.asList("jpg", "jpeg", "png", "gif");

    public List<ItemImage> saveItemImages(
            List<MultipartFile> img, List<Boolean> isMainList) throws IOException {
        List<ItemImage> imageList = new ArrayList<>();

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
                String fullPath = uploadDir + "/item-images/" + uniqueName;

                File dir = new File(uploadDir + "/item-images/");
                if(!dir.exists()) dir.mkdirs();

                file.transferTo(new File(fullPath));

                ItemImage image = ItemImage.builder()
                        .imgUrl("/item-images/" + uniqueName)
                        .isMain(isMain)
                        .build();

                imageList.add(image);
            }
        }

        return imageList;
    }

    public String saveUserImage(MultipartFile userimg) throws IOException {
        String userImagePath = null;

        if(!userimg.isEmpty()) {
            String originFilename = userimg.getOriginalFilename();
            String ext = originFilename.substring(originFilename.lastIndexOf(".") + 1).toLowerCase();

            if(!SUPPORTED_EXTENSIONS.contains(ext)) {
                throw new IOException("허용되지 않은 파일 형식입니다!");
            }

            String uniqueName = UUID.randomUUID().toString() + "." + ext;
            String fullPath = uploadDir + "/user-images/" + uniqueName;

            File dir = new File(uploadDir + "/user-images/");
            if(!dir.exists()) dir.mkdirs();

            userimg.transferTo(new File(fullPath));

            userImagePath = "/user-images/" + uniqueName;
        }

        return userImagePath;
    }
}
