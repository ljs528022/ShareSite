package com.lec.spring.repository;

import com.lec.spring.domain.Item;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.ui.Model;

import java.util.List;

@Mapper
public interface ItemRepository {

    // Write Item
    int write(Item item);

    // Write Item's Imgs
    int insertImage(Long itemKey, String url);

    // Find All Item
    List<Item> findAllItem();

    // Find Latest 5 Item
    List<Item> getLatestItems();

    // Find Weekly Most Traded Items
    List<Item> getWeeklyItems();

    // Find By ItemKey
    Item findByItemKey(@Param("itemKey")Long itemKey);

    // Find By Category
    List<Item> findByCategory(@Param("cateKey")Long cateKey);

    // Find By UserKey
    List<Item> findByUserKey(@Param("userKey")Long userKey);

    // Increment View Count
    int incViewCnt(Long itemKey);

    // Delete Item
    int delete(Item item);

    // Modify Item
    int modify(Item item);

    // Change Trade State
    int chTradeState(Long itemKey);


    // -- User Page --


    // -- Admin Page --


}
