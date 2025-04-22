package com.lec.spring.service;

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

    Item findByItemKey(Long itemKey);

    // Find By ItemKey
    List<Item> findByCategory(Long cateKey);

    // Find Item By UserKey
    List<Item> findByUserKey(Long userKey);

    int write(Item item, List<ItemImage> imageList);

    // Item's Detail
    Item detail(Long itemKey);

    // Item Modify
    int modify(Item item);

    // Change Item's Trade State
    int chTradeState(Long itemKey);

    // Delete Item
    int delete(Long itemKey);




}
