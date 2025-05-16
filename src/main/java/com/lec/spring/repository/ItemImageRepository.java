package com.lec.spring.repository;

import com.lec.spring.domain.ItemImage;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ItemImageRepository {

    // 새 이미지 정보 삽입
    int insert(ItemImage image);

    // 상품 키로 이미지 찾기
    List<ItemImage> findByItemKey(@Param("itemKey")Long itemKey);

    // 아이템 키들로 이미지들 찾기
    List<ItemImage> findImagesByItemKeys(List<Long> itemKeys);

    // 이미지 경로로 이미지 찾기
    ItemImage findByUrl(@Param("imgUrl")String imgUrl);

    // 이미지의 IsMain 업데이트
    void updateIsMain(@Param("imgUrl")String imgUrl, Boolean isMain);

    // 이미지 삭제하기
    void deleteImagesByUrls(@Param("imgUrls") List<String> imgUrls);
}
