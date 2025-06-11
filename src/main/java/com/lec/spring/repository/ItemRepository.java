package com.lec.spring.repository;

import com.lec.spring.DTO.ItemDTO;
import com.lec.spring.domain.Item;
import com.lec.spring.domain.ItemImage;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.security.core.parameters.P;
import org.springframework.ui.Model;

import java.util.List;
import java.util.Map;

@Mapper
public interface ItemRepository {

    // Write Item
    int write(Item item);

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

    // Search Items By category, min-price, max-price
    List<ItemDTO> searchItems(@Param("rangeStart")Long rangeStart, @Param("rangeEnd")Long rangeEnd, @Param("min")Long min, @Param("max")Long max);

    // Search Items By Keyword
    List<ItemDTO> searchItemsByKeyword(@Param("keyword")String keyword);

    // Find By ItemKey
    ItemDTO findByItemKey(@Param("itemKey")Long itemKey);

    // Find Items By ItemKeys
    List<ItemDTO> findItemsByKeys(List<Long> itemKeys);

    // Find By Category
    List<Item> findByCategory(@Param("cateKey")Long cateKey);

    // Find By UserKey
    List<ItemDTO> findByUserKey(@Param("userKey")String userKey);

    List<ItemImage> findImagesByItemKeys(List<Long> itemKeys);

    Item findItemByItemKey(@Param("itemKey")Long itemKey);

    List<Map<String, Long>> getAvgMaxMinPrice(@Param("keyword")String keyword);

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
