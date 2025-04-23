package com.lec.spring.service;

import com.lec.spring.DTO.ItemDTO;
import com.lec.spring.domain.Item;
import com.lec.spring.domain.ItemImage;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface ItemService {

    // Find All Item
    List<Item> findAllItem();

    // Find Latest 5 Items
    List<Item> getLatestItems();

    // Find Weekly Most Traded Items
    List<Item> getWeeklyItems();

    ItemDTO findByItemKey(Long itemKey);

    // Find By ItemKey
    List<Item> findByCategory(Long cateKey);

    // Find Item By UserKey
    List<Item> findByUserKey(String userKey);

    // Find Img By ItemKey
    List<ItemImage> findImgByItemKey(Long itemKey);

    Long write(Item item, List<ItemImage> imageList);

    // Item's Detail
    ItemDTO detail(Long itemKey);

    // Item Modify
    int modify(Item item);

    // Change Item's Trade State
    int chTradeState(Long itemKey);

    // Delete Item
    int delete(Long itemKey);




}
