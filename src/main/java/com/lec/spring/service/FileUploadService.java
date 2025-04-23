package com.lec.spring.service;

import com.lec.spring.domain.ItemImage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestPart;
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

    public List<ItemImage> saveFiles(
            List<MultipartFile> img, List<Boolean> isMainList) throws IOException {
        List<ItemImage> imageList = new ArrayList<>();

        for(int i = 0; i < img.size(); i++) {
            MultipartFile file = img.get(i);
            boolean isMain = isMainList != null && i < isMainList.size() ? isMainList.get(i) : false;

            if(!file.isEmpty()) {
                String originFilename = file.getOriginalFilename();
                String ext = originFilename.substring((originFilename.lastIndexOf(".")));
                String uniqueName = UUID.randomUUID().toString() + ext;
                String fullPath = uploadDir + "/" + uniqueName;

                File dir = new File(uploadDir);
                if(!dir.exists()) dir.mkdirs();

                file.transferTo(new File(fullPath));

                ItemImage image = ItemImage.builder()
                        .imgUrl("/static/item-images/" + uniqueName)
                        .isMain(isMain)
                        .build();

                imageList.add(image);
            }
        }

        return imageList;
    }
}
