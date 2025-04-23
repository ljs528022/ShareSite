package com.lec.spring.service;

import com.lec.spring.DTO.ItemDTO;
import com.lec.spring.DTO.LocationDTO;
import com.lec.spring.domain.Item;
import com.lec.spring.domain.ItemImage;
import com.lec.spring.domain.Location;
import com.lec.spring.repository.CategoryRepository;
import com.lec.spring.repository.ItemRepository;
import com.lec.spring.repository.LocationRepository;
import com.lec.spring.repository.UserRepository;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ItemServiceImpl implements ItemService {

    private UserRepository userRepository;
    private ItemRepository itemRepository;
    private CategoryRepository categoryRepository;
    private LocationRepository locationRepository;

    @Autowired
    public ItemServiceImpl(SqlSession sqlSession) {
        this.userRepository = sqlSession.getMapper(UserRepository.class);
        this.itemRepository = sqlSession.getMapper(ItemRepository.class);
        this.categoryRepository = sqlSession.getMapper(CategoryRepository.class);
        this.locationRepository = sqlSession.getMapper(LocationRepository.class);

        System.out.println("✅ ItemService() Created");
    }

    @Override
    public List<Item> findAllItem() {
        return itemRepository.findAllItem();
    }

    @Override
    public List<ItemDTO> getLatestItems() {
        List<ItemDTO> items = itemRepository.getLatestItems();
        List<Long> itemKeys = items.stream().map(ItemDTO::getItemKey).toList();

        Map<Long, List<LocationDTO>> locationMap = locationRepository.findLocationsByItemKeys(itemKeys)
                .stream().collect(Collectors.groupingBy(LocationDTO::getItemKey));
        Map<Long, List<ItemImage>> imageMap = itemRepository.findImagesByItemKeys(itemKeys)
                .stream().collect(Collectors.groupingBy(ItemImage::getImageKey));

        for(ItemDTO item : items) {
            item.setLocations(locationMap.getOrDefault(item.getItemKey(), new ArrayList<>()));
            item.setImages(imageMap.getOrDefault(item.getItemKey(), new ArrayList<>()));
        }

        return items;
    }

    @Override
    public List<ItemDTO> getWeeklyItems() {
        List<ItemDTO> items = itemRepository.getWeeklyItems();
        List<Long> itemKeys = items.stream().map(ItemDTO::getItemKey).toList();

        Map<Long, List<LocationDTO>> locationMap = locationRepository.findLocationsByItemKeys(itemKeys)
                .stream().collect(Collectors.groupingBy(LocationDTO::getItemKey));
        Map<Long, List<ItemImage>> imageMap = itemRepository.findImagesByItemKeys(itemKeys)
                .stream().collect(Collectors.groupingBy(ItemImage::getItemKey));

        for(ItemDTO item : items) {
            item.setLocations(locationMap.getOrDefault(item.getItemKey(), new ArrayList<>()));
            item.setImages(imageMap.getOrDefault(item.getItemKey(), new ArrayList<>()));
        }

        return items;
    }

    @Override
    public ItemDTO findByItemKey(Long itemKey) {return itemRepository.findByItemKey(itemKey);}

    @Override
    public List<Item> findByCategory(Long cateKey) {
        return itemRepository.findByCategory(cateKey);
    }

    @Override
    public List<Item> findByUserKey(String userKey) {
        return itemRepository.findByUserKey(userKey);
    }

    @Override
    public List<ItemImage> findImgByItemKey(Long itemKey) {
        return itemRepository.findImgByItemKey(itemKey);
    }

    @Override
    public Long write(Item item, List<ItemImage> imageList) {
        int result = itemRepository.write(item);
        if(result > 0) {
            Long itemKey = item.getItemKey();
            for(ItemImage image : imageList) {
                image.setItemKey(itemKey);
                result = itemRepository.insertImage(image);
            }
        }
        return item.getItemKey();
    }

    @Override
    public int modify(Item item) {
        int result = itemRepository.modify(item);
        return result;
    }

    @Override
    public ItemDTO detail(Long itemKey) {
        itemRepository.incViewCnt(itemKey);
        Item item = itemRepository.findItemByItemKey(itemKey);
        List<LocationDTO> locations = locationRepository.findByUserKeyAndItemKey(item.getUserKey(), itemKey);
        List<ItemImage> images = itemRepository.findImgByItemKey(itemKey);


        // ItemDTO 로 정보 등록
        ItemDTO itemInfo = new ItemDTO();
            itemInfo.setUserKey(item.getUserKey());
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
    @Transactional
    public int delete(Long itemKey) {
        int result = 0;

        ItemDTO item = itemRepository.findByItemKey(itemKey);
        if (item != null) {
            result = itemRepository.delete(item);
        }
        return result;
    }

}
