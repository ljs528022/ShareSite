package com.lec.spring.service;

import com.lec.spring.domain.Item;
import com.lec.spring.repository.CategoryRepository;
import com.lec.spring.repository.ItemRepository;
import com.lec.spring.repository.UserRepository;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ItemServiceImpl implements ItemService {

    private UserRepository userRepository;
    private ItemRepository itemRepository;
    private CategoryRepository categoryRepository;

    @Autowired
    public ItemServiceImpl(SqlSession sqlSession) {
        this.userRepository = sqlSession.getMapper(UserRepository.class);
        this.itemRepository = sqlSession.getMapper(ItemRepository.class);
        this.categoryRepository = sqlSession.getMapper(CategoryRepository.class);

        System.out.println("✅ ItemService() Created");
    }

    @Override
    public List<Item> findAllItem() {
        return itemRepository.findAllItem();
    }

    @Override
    public List<Item> getLatestItems() {
        return itemRepository.getLatestItems();
    }

    @Override
    public List<Item> getWeeklyItems() {return itemRepository.getWeeklyItems();}

    @Override
    public Item findByItemKey(Long itemKey) {return itemRepository.findByItemKey(itemKey);}

    @Override
    public List<Item> findByCategory(Long cateKey) {
        return itemRepository.findByCategory(cateKey);
    }

    @Override
    public List<Item> findByUserKey(Long userKey) {
        return itemRepository.findByUserKey(userKey);
    }

    @Override
    public int write(Item item, List<String> urls) {
        int result = itemRepository.write(item);
        if(result > 0) {
            Long itemKey = item.getItemKey();
            for(String url : urls) {
                itemRepository.insertImage(itemKey, url);
            }
        }
        return result;
    }

    @Override
    public int modify(Item item) {
        int result = itemRepository.modify(item);
        return result;
    }

    @Override
    public Item detail(Long itemKey) {
        itemRepository.incViewCnt(itemKey);
        Item item = itemRepository.findByItemKey(itemKey);

        return item;
    }
    @Override
    public int chTradeState(Long itemKey) {
        Item item = itemRepository.findByItemKey(itemKey);
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

        Item item = itemRepository.findByItemKey(itemKey);
        if (item != null) {
            result = itemRepository.delete(item);
        }
        return result;
    }

}
