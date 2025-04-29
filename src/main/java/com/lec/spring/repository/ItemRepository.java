package com.lec.spring.repository;

import com.lec.spring.DTO.ItemDTO;
import com.lec.spring.domain.Item;
import com.lec.spring.domain.ItemImage;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.ui.Model;

import java.util.List;

@Mapper
public interface ItemRepository {

    // Write Item
    int write(Item item);

    // Write Item's Imgs
    int insertImage(ItemImage itemImages);

    // Find All Item
    List<Item> findAllItem();

    // Find Latest 5 Item
    List<ItemDTO> getLatestItems();

    // Find Weekly Most Traded Items
    List<ItemDTO> getWeeklyItems();

    // Find Item's Seller Items
    List<ItemDTO> getSellerItems(@Param("userKey")String userKey);

    // Find Items same category
    List<ItemDTO> getItemsLikeCate(@Param("cateKey")Long cateKey);

    // Find By ItemKey
    ItemDTO findByItemKey(@Param("itemKey")Long itemKey);

    // Find By Category
    List<Item> findByCategory(@Param("cateKey")Long cateKey);

    // Find By UserKey
    List<Item> findByUserKey(@Param("userKey")String userKey);

    // Find Img By ItemKey
    List<ItemImage> findImgByItemKey(@Param("itemKey")Long itemKey);

    List<ItemImage> findImagesByItemKeys(List<Long> itemKeys);

    Item findItemByItemKey(@Param("itemKey")Long itemKey);



    // Increment View Count
    int incViewCnt(Long itemKey);

    // Delete Item
    int delete(@Param("itemKey")Long itemKey);

    // Modify Item
    int modify(Item item);

    // Change Trade State
    int chTradeState(Long itemKey);


    // -- User Page --


    // -- Admin Page --


}
