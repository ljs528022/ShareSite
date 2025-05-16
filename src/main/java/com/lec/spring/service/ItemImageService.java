package com.lec.spring.service;

import com.lec.spring.domain.ItemImage;

import java.util.List;

public interface ItemImageService {

    // 아이템 이미지 찾기
    List<ItemImage> findByItemKey(Long itemKey);

    // 아이템 키들로 이미지들 찾기
    List<ItemImage> findImagesByItemKeys(List<Long> itemKeys);

    // 이미지 경로로 이미지 찾기
    ItemImage findByUrl(String imgUrl);

    void saveAll(List<ItemImage> itemImages);

    // 이미지 삭제하기
    void deleteImagesByUrls(List<String> imgUrls);
}
