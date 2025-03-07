package com.lec.spring.service;

import com.lec.spring.domain.Item;
import com.lec.spring.domain.User;
import com.lec.spring.repository.CategoryRepository;
import com.lec.spring.repository.ItemRepository;
import com.lec.spring.repository.UserRepository;
import com.lec.spring.util.U;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ItemServiceImpl implements ItemService {

    @Value("${app.pagination.write_pages}")
    private int WRITE_PAGES;
    @Value("${app.pagination.page_rows}")
    private int PAGE_ROWS;

    @Autowired
    private UserRepository userRepository;
    private ItemRepository itemRepository;
    private CategoryRepository categoryRepository;

    @Autowired
    public ItemServiceImpl(SqlSession sqlSession) {
        this.itemRepository = sqlSession.getMapper(ItemRepository.class);
        System.out.println(getClass().getName() + "() Created");
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
    public Item findByItemKey(Long itemKey) {
        return itemRepository.findByItemKey(itemKey);
    }

    @Override
    public Item findByUserKey(Long userKey) {
        return itemRepository.findByUserKey(userKey);
    }

    @Override
    public int write(Item item) {
        // logged User's Info
        User user = U.getLoggedUser();

        user = userRepository.findByUserKey(user.getUserKey());
        item.setUser(user);

        int cnt = itemRepository.write(item);

        return cnt;
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
            if (item.getTradeStatus() != Boolean.FALSE) {
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
