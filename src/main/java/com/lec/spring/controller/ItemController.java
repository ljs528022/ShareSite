package com.lec.spring.controller;

import com.lec.spring.domain.Item;
import com.lec.spring.service.FileUploadService;
import com.lec.spring.service.ItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5178/")
@RequestMapping("/product")
public class ItemController {

    private FileUploadService fileUploadService;
    private ItemService itemService;

    @PostMapping("/wirte")
    public ResponseEntity<?> uploadItem(
            @RequestPart("item") Item item,
            @RequestPart("img")List<MultipartFile> img) throws IOException {
        List<String> urls = fileUploadService.saveFiles(img);
        itemService.write(item, urls);
        return ResponseEntity.ok("등록 성공!");
    }


}
