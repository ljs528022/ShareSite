package com.lec.spring.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lec.spring.DTO.ItemDTO;
import com.lec.spring.DTO.LikeDTO;
import com.lec.spring.DTO.LocationDTO;
import com.lec.spring.domain.Item;
import com.lec.spring.domain.ItemImage;
import com.lec.spring.domain.Like;
import com.lec.spring.domain.Location;
import com.lec.spring.service.FileUploadService;
import com.lec.spring.service.ItemService;
import com.lec.spring.service.LikeService;
import com.lec.spring.service.LocationService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
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
    @Autowired
    private LikeService likeService;

    // Write Item
    @PostMapping(value = "/write")
    public ResponseEntity<?> write(
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

            imageList = fileUploadService.saveItemImages(img, isMainList);
        }
        Long itemKey = itemService.write(item, imageList);

        List<LocationDTO> locations = itemDTO.getLocations();
        if(locations != null && !locations.isEmpty()) {
            for(LocationDTO locationDTO : locations) {
                Location location = Location.builder()
                        .userKey(itemDTO.getUserKey())
                        .itemKey(item.getItemKey())
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

    // Get Item's Detail
    @GetMapping("/{itemKey}")
    public ResponseEntity<ItemDTO> getItemDetail(@PathVariable("itemKey") Long itemKey, HttpServletRequest request, HttpServletResponse response) {
        ItemDTO item = itemService.detail(itemKey);

        Cookie[] cookies = request.getCookies();
        boolean viewed = false;

        if(cookies != null) {
            for(Cookie cookie : cookies) {
                if(cookie.getName().equals("viewed_" + itemKey)) {
                    viewed = true;
                    break;
                }
            }
        }

        if(!viewed) {
            itemService.incViewCnt(itemKey);

            Cookie viewCookie = new Cookie("viewed_" + itemKey, "true");
            viewCookie.setMaxAge(30 * 60); // 30분
            viewCookie.setPath("/product");
            response.addCookie(viewCookie);
        }

        if (item != null) {
            return ResponseEntity.ok(item);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete Item
    @DeleteMapping("/delete/{itemKey}")
    public ResponseEntity<?> delete(@PathVariable("itemKey")Long itemKey) {
        itemService.delete(itemKey);

        return ResponseEntity.ok("삭제 성공!");
    }


    @GetMapping("/seller/{userKey}")
    public Map<String, Object> getSellerItems(@PathVariable("userKey")String userKey) {
        Map<String, Object> response = new HashMap<>();

        List<ItemDTO> sellerItems = itemService.getSellerItems(userKey);
        response.put("sellerItems", sellerItems);

        return response;
    }

    @GetMapping("/cate/{cateKey}")
    public Map<String, Object> getSameCateItems(@PathVariable("cateKey")Long cateKey) {
        Map<String, Object> response = new HashMap<>();

        List<ItemDTO> sameCateItems = itemService.getItemsLikeCate(cateKey);
        response.put("sameCateItems", sameCateItems);

        return response;
    }
}
