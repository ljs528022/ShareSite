package com.lec.spring.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lec.spring.DTO.ItemDTO;
import com.lec.spring.DTO.LocationDTO;
import com.lec.spring.domain.Item;
import com.lec.spring.domain.ItemImage;
import com.lec.spring.domain.Location;
import com.lec.spring.service.FileUploadService;
import com.lec.spring.service.ItemService;
import com.lec.spring.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.lang.Long.parseLong;

@RestController
@RequestMapping("/product")
@CrossOrigin(origins = "http://localhost:5178")
public class ItemController {

    @Autowired
    private FileUploadService fileUploadService;
    @Autowired
    private ItemService itemService;
    @Autowired
    private LocationService locationService;

    @PostMapping(value = "/write")
    public ResponseEntity<?> uploadItem(
            @RequestPart("item") ItemDTO itemDTO,
            @RequestPart(value = "img", required = false)List<MultipartFile> img,
            @RequestPart(value = "imgMeta", required = false) String isMains) throws IOException {
        Item item = Item.builder()
                .userKey(itemDTO.getUserKey())
                .cateKey(itemDTO.getCateKey())
                .subject(itemDTO.getSubject())
                .content(itemDTO.getContent())
                .price(itemDTO.getPrice())
                .itemtype(itemDTO.getItemtype())
                .purtype(itemDTO.getPurtype())
                .tradestatus(false)
                .writeDate(LocalDateTime.now())
                .viewcnt(parseLong("0"))
                .build();

        List<ItemImage> imageList = new ArrayList<>();
        if(img != null && !img.isEmpty() && isMains != null) {
            ObjectMapper objectMapper = new ObjectMapper();
            List<Map<String, Boolean>> metaList = objectMapper.readValue(isMains, new TypeReference<>() {});
            List<Boolean> isMainList = metaList.stream()
                    .map(meta -> meta.getOrDefault("isMain", false))
                    .toList();

            imageList = fileUploadService.saveFiles(img, isMainList);
        }
        Long itemKey = itemService.write(item, imageList);

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

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("message", "등록 성공!");
        responseBody.put("itemKey", itemKey);
        return ResponseEntity.ok(responseBody);
    }


}
