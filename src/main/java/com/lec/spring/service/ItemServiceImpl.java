package com.lec.spring.service;

import com.lec.spring.DTO.ItemDTO;
import com.lec.spring.DTO.LocationDTO;
import com.lec.spring.domain.Item;
import com.lec.spring.domain.ItemImage;
import com.lec.spring.domain.Location;
import com.lec.spring.domain.User;
import com.lec.spring.repository.*;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ItemServiceImpl implements ItemService {

    private UserRepository userRepository;
    private ItemRepository itemRepository;
    private ItemImageRepository itemImageRepository;
    private CategoryRepository categoryRepository;
    private LocationRepository locationRepository;

    @Autowired
    public ItemServiceImpl(SqlSession sqlSession) {
        this.userRepository = sqlSession.getMapper(UserRepository.class);
        this.itemRepository = sqlSession.getMapper(ItemRepository.class);
        this.itemImageRepository = sqlSession.getMapper(ItemImageRepository.class);
        this.categoryRepository = sqlSession.getMapper(CategoryRepository.class);
        this.locationRepository = sqlSession.getMapper(LocationRepository.class);

        System.out.println("✅ ItemService() Created");
    }

    @Override
    public List<Item> findAllItem() {
        return itemRepository.findAllItem();
    }

    @Override
    public List<ItemDTO> findByUserKey(String userKey) {
        List<ItemDTO> items = itemRepository.findByUserKey(userKey);

        loadItemsLocationAndImage(items);
        return items;
    }

    @Override
    public ItemDTO findByItemKey(Long itemKey) {
        return itemRepository.findByItemKey(itemKey);
    }

    @Override
    public List<ItemDTO> findItemsByKeys(List<Long> itemKeys) {
        if(itemKeys == null || itemKeys.isEmpty()) return Collections.emptyList();
        List<ItemDTO> items = itemRepository.findItemsByKeys(itemKeys);

        loadItemsLocationAndImage(items);
        return items;
    }

    @Override
    public List<ItemDTO> getLatestItems(int limit) {
        List<ItemDTO> items = itemRepository.getLatestItems(limit);

        loadItemsLocationAndImage(items);
        return items;
    }

    @Override
    public List<ItemDTO> getWeeklyItems(int limit) {
        List<ItemDTO> items = itemRepository.getWeeklyItems(limit);

        loadItemsLocationAndImage(items);
        return items;
    }

    @Override
    public List<ItemDTO> getSellerItems(String userKey) {
        List<ItemDTO> items = itemRepository.getSellerItems(userKey);

        loadItemsLocationAndImage(items);
        return items;
    }

    @Override
    public List<ItemDTO> getItemsLikeCate(Long cateKey) {
        List<ItemDTO> items = itemRepository.getItemsLikeCate(cateKey);

        loadItemsLocationAndImage(items);
        return items;
    }

    @Override
    public List<ItemDTO> searchItems(Long rangeStart, Long rangeEnd, Long min, Long max) {
        List<ItemDTO> items = itemRepository.searchItems(rangeStart, rangeEnd, min, max);

        loadItemsLocationAndImage(items);
        return items;
    }

    @Override
    public List<ItemDTO> searchItemsByKeyword(String keyword) {
        List<ItemDTO> items = itemRepository.searchItemsByKeyword(keyword);

        loadItemsLocationAndImage(items);
        return items;
    }

    @Override
    public List<Map<String, Long>> getAvgMaxMinPrice(String keyword) {
        return itemRepository.getAvgMaxMinPrice(keyword);
    }

    @Override
    public Long write(Item item, List<ItemImage> imageList) {
        int result = itemRepository.write(item);
        if(result > 0) {
            Long itemKey = item.getItemKey();
            for(ItemImage image : imageList) {
                image.setItemKey(itemKey);
                result = itemImageRepository.insert(image);
            }
        }
        return item.getItemKey();
    }

    @Override
    public int modify(Item item) {
        return itemRepository.modify(item);
    }

    @Override
    public ItemDTO detail(Long itemKey) {
        Item item = itemRepository.findItemByItemKey(itemKey);
        List<LocationDTO> locations = locationRepository.findByUserKeyAndItemKey(item.getUserKey(), itemKey);
        List<ItemImage> images = itemImageRepository.findByItemKey(itemKey);

        // 판매자 정보 가져오기
        String userKey = item.getUserKey();
        String useralias = userRepository.findByUserKey(userKey).getUseralias();

        // ItemDTO 로 정보 등록
        ItemDTO itemInfo = new ItemDTO();
            itemInfo.setItemKey(item.getItemKey());
            itemInfo.setUserKey(item.getUserKey());
            itemInfo.setUseralias(useralias);
            itemInfo.setCateKey(item.getCateKey());
            itemInfo.setSubject(item.getSubject());
            itemInfo.setContent(item.getContent());
            itemInfo.setPrice(item.getPrice());
            itemInfo.setItemtype(item.getItemtype());
            itemInfo.setPurtype(item.getPurtype());
            itemInfo.setTradestatus(item.getTradestatus());
            itemInfo.setWriteDate(item.getWriteDate());
            itemInfo.setViewcnt(item.getViewcnt());
            itemInfo.setLocations(locations);
            itemInfo.setImages(images);

        return itemInfo;
    }
    @Override
    public int chTradeState(Long itemKey) {
        ItemDTO item = itemRepository.findByItemKey(itemKey);
        if (item != null) {
            if (item.getTradestatus() != Boolean.FALSE) {
                itemRepository.chTradeState(itemKey);
            }
            return 1;
        } else {
            return 0;
        }
    }

    @Override
    public int delete(Long itemKey) {
        int result = 0;

        if(itemKey != null) {
            result = itemRepository.delete(itemKey);
        }

        return result;
    }

    @Override
    public void incViewCnt(Long itemKey) {
        itemRepository.incViewCnt(itemKey);
    }


    // 불러온 상품 들의 거래 지역, 이미지를 불러오는 공통 로직
    private void loadItemsLocationAndImage(List<ItemDTO> items) {
        if(items.isEmpty()) return;

        List<Long> itemKeys = items.stream().map(ItemDTO::getItemKey).toList();

        Map<Long, List<LocationDTO>> locationMap = locationRepository.findLocationsByItemKeys(itemKeys)
                .stream().collect(Collectors.groupingBy(LocationDTO::getItemKey));
        Map<Long, List<ItemImage>> imageMap = itemImageRepository.findImagesByItemKeys(itemKeys)
                .stream().collect(Collectors.groupingBy(ItemImage::getItemKey));

        for(ItemDTO item: items) {
            item.setLocations(locationMap.getOrDefault(item.getItemKey(), new ArrayList<>()));
            item.setImages(imageMap.getOrDefault(item.getItemKey(), new ArrayList<>()));
        }
    }
}
