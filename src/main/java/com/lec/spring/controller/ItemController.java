package com.lec.spring.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lec.spring.DTO.ItemDTO;
import com.lec.spring.DTO.LocationDTO;
import com.lec.spring.DTO.UserInfoResponse;
import com.lec.spring.domain.*;
import com.lec.spring.service.*;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

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
    private UserService userService;
    @Autowired
    private ItemImageService itemImageService;
    @Autowired
    private LocationService locationService;
    @Autowired
    private LikeService likeService;
    @Autowired
    private ReviewService reviewService;

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
                        .itemKey(itemKey)
                        .address(locationDTO.getAddress())
                        .useralias(locationDTO.getUseralias())
                        .zoneCode(locationDTO.getZoneCode())
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
    public ResponseEntity<?> getItemDetail(@PathVariable("itemKey")Long itemKey, HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> res = new HashMap<>();

        ItemDTO item = itemService.detail(itemKey);
        String userKey = item.getUserKey();
        User user = userService.findByUserKey(userKey);
        List<Review> reviews = reviewService.findReviewsBySellerKey(userKey);
        double trustScore = userService.getTrustScore(userKey);
        UserInfoResponse itemUser = new UserInfoResponse(
                user.getUserKey(),
                user.getUsername(),
                user.getUseralias(),
                user.getEmail(),
                user.getState(),
                user.getTradecnt(),
                user.getUserimg(),
                trustScore,
                user.getAuth()
        );

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

        res.put("item", item);
        res.put("itemUser", itemUser);
        res.put("reviews", reviews);

        return ResponseEntity.ok(res);
    }

    // Modify Item
    @PostMapping("/modify/{itemKey}")
    public ResponseEntity<?> modify(@PathVariable("itemKey")Long itemKey,
                                    @RequestPart("item") ItemDTO itemDTO,
                                    @RequestPart(value = "images", required = false) List<MultipartFile> images,
                                    @RequestPart(value = "existingImages", required = false) List<String> existingImages,
                                    @RequestPart(value = "imgMeta", required = false) String isMains) throws IOException {
        Item item = Item.builder()
                .itemKey(itemKey)
                .userKey(itemDTO.getUserKey())
                .cateKey(itemDTO.getCateKey())
                .subject(itemDTO.getSubject())
                .content(itemDTO.getContent())
                .price(itemDTO.getPrice())
                .itemtype(itemDTO.getItemtype())
                .purtype(itemDTO.getPurtype())
                .build();

        // ▼ 이미지 수정
        // 1. 기존 이미지 DB 조회
        List<ItemImage> currentImages = itemImageService.findByItemKey(itemKey);
        List<String> currentImgUrls = currentImages.stream()
                .map(ItemImage::getImgUrl)
                .toList();

        // 2. 그 중에 없어진 이미지가 있는지 확인
        List<String> toDeleteUrls = currentImgUrls.stream()
                .filter(url -> existingImages == null || !existingImages.contains(url))
                .toList();

        // 3. 없어진 이미지가 있다면 서버에서 삭제
        itemImageService.deleteImagesByUrls(toDeleteUrls);
        fileUploadService.deleteFilesByUrls(toDeleteUrls);

        // 4. 새 이미지 업로드
        List<ItemImage> newImages = new ArrayList<>();
        if(images != null && !images.isEmpty()) {
            ObjectMapper objectMapper = new ObjectMapper();
            List<Map<String, Boolean>> metaList = objectMapper.readValue(isMains, new TypeReference<>() {});
            List<Boolean> isMainList = metaList.stream()
                    .map(meta -> meta.getOrDefault("isMain", false))
                    .toList();

            newImages = fileUploadService.saveItemImages(images, isMainList);
        }

        // 5. 기존에 있던 이미지 객체 재구성
        List<ItemImage> updatedImages = new ArrayList<>();
        if(existingImages != null) {
            for(String url : existingImages) {
                ItemImage img = itemImageService.findByUrl(url);
                updatedImages.add(img);
            }
        }

        // 6. 전체 이미지 리스트 재정렬
        List<Map<String, Boolean>> metaList = new ObjectMapper().readValue(isMains, new TypeReference<List<Map<String, Boolean>>>() {});
        List<ItemImage> finalImageList = new ArrayList<>();
        for(int i = 0; i < metaList.size(); i++) {
            Map<String, Boolean> meta = metaList.get(i);
            boolean isMain = meta.getOrDefault("isMain", false);

            ItemImage img;
            if(i < updatedImages.size()) {
                img = updatedImages.get(i);
            } else {
                img = newImages.get(i - updatedImages.size());
            }

            img.setItemKey(itemKey);
            img.setIsMain(isMain);
            finalImageList.add(img);
        }
        // 7. 이미지 정보 갱신
        itemImageService.saveAll(finalImageList);

        // ▼ 장소 수정
        if(itemDTO.getLocations() != null && !itemDTO.getLocations().isEmpty()) {
            locationService.updateLocation(itemKey, itemDTO.getUserKey(), itemDTO.getLocations());
        }

        int result = itemService.modify(item);
        if(result < 1) {
            return ResponseEntity.badRequest().body("수정 실패...");
        }
        return ResponseEntity.ok("수정 완료!");

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
