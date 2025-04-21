package com.lec.spring.controller;

import com.lec.spring.DTO.ItemDTO;
import com.lec.spring.DTO.LocationDTO;
import com.lec.spring.domain.Item;
import com.lec.spring.domain.Location;
import com.lec.spring.service.FileUploadService;
import com.lec.spring.service.ItemService;
import com.lec.spring.service.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/product")
@CrossOrigin(origins = "http://localhost:5178")
public class ItemController {

    @Autowired
    private FileUploadService fileUploadService;
    private ItemService itemService;
    private LocationService locationService;

    @PostMapping("/write")
    public ResponseEntity<?> uploadItem(
            @RequestPart("item") ItemDTO itemDTO,
            @RequestPart("img")List<MultipartFile> img) throws IOException {
        Item item = Item.builder()
                .userKey(itemDTO.getUserKey())
                .cateKey(itemDTO.getCateKey())
                .subject(itemDTO.getSubject())
                .content(itemDTO.getContent())
                .price(itemDTO.getPrice())
                .build();

        List<String> urls = new ArrayList<>();
        if(img != null && !img.isEmpty()) {
            urls = fileUploadService.saveFiles(img);
        }
        itemService.write(item, urls);

        List<LocationDTO> locations = itemDTO.getLocations();
        if(locations != null && !locations.isEmpty()) {
            for(LocationDTO locationDTO : locations) {
                Location location = Location.builder()
                        .userKey(itemDTO.getUserKey())
                        .addrName(locationDTO.getAddrName())
                        .placeName(locationDTO.getPlaceName())
                        .addrDetail(locationDTO.getAddrDetail())
                        .build();

                locationService.saveLocation(location);
            }
        }

        return ResponseEntity.ok("등록 성공!");
    }


}
