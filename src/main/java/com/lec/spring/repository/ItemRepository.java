package com.lec.spring.repository;

import com.lec.spring.domain.Item;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.ui.Model;

import java.util.List;

@Mapper
public interface ItemRepository {

    // Regist Item
    int write(Item item);

    // List Items
    List<Item> list();
    List<Item> list(Integer page, Model model, String keyword, String category);

    // Find All Item
    List<Item> findAllItem();

    // Find Latest 5 Item
    List<Item> getLatestItems();

    // Find By ItemKey
    Item findByItemKey(@Param("itemKey")Long itemKey);

    // Find By UserKey
    Item findByUserKey(@Param("userKey")Long userKey);

    // Increment View Count
    int incViewCnt(Long itemKey);

    // Delete Item
    int delete(Item item);

    // Modify Item
    int modify(Item item);

    // Change Trade State
    int chTradeState(Long itemKey);


    // -- Paging --
    int countAll();

    // -- User Page --


    // -- Admin Page --


}
