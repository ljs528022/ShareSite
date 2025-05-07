package com.lec.spring.service;

import com.lec.spring.DTO.ItemDTO;
import com.lec.spring.domain.Item;
import com.lec.spring.domain.ItemImage;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface ItemService {

    // Find All Item
    List<Item> findAllItem();

    // Find Items By UserKey
    List<ItemDTO> findByUserKey(String userKey);

    // Find Items By ItemKey
    ItemDTO findByItemKey(Long itemKey);

    // Find Items By ItemKeys
    List<ItemDTO> findItemsByKeys(List<Long> itemKeys);

    // Find Latest 5 Items
    List<ItemDTO> getLatestItems();

    // Find Weekly Most Traded Items
    List<ItemDTO> getWeeklyItems();

    List<ItemDTO> getSellerItems(String userKey);

    List<ItemDTO> getItemsLikeCate(Long cateKey);

    // Search Items By category, min-price, max-price
    List<ItemDTO> searchItems(Long rangeStart, Long rangeEnd, Long min, Long max);

    // Search Items By Keyword
    List<ItemDTO> searchItemsByKeyword(String keyword);



    Long write(Item item, List<ItemImage> imageList);

    // Item's Detail
    ItemDTO detail(Long itemKey);

    // Item Modify
    int modify(Item item);

    // Change Item's Trade State
    int chTradeState(Long itemKey);

    // Delete Item
    int delete(Long itemKey);

    void incViewCnt(Long itemKey);




}
