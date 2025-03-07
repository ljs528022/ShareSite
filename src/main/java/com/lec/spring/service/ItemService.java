package com.lec.spring.service;

import com.lec.spring.domain.Item;

import java.util.List;

public interface ItemService {

    // Find All Item
    List<Item> findAllItem();

    // Find Latest 5 Items
    List<Item> getLatestItems();

    // Find Item By ItemKey
    Item findByItemKey(Long itemKey);

    // Find Item By UserKey
    Item findByUserKey(Long userKey);

    int write(Item item);

    // Item's Detail
    Item detail(Long itemKey);

    // Item Modify
    int modify(Item item);

    // Change Item's Trade State
    int chTradeState(Long itemKey);

    // Delete Item
    int delete(Long itemKey);




}
