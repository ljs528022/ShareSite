package com.lec.spring.service;

import com.lec.spring.domain.ItemImage;
import com.lec.spring.repository.ItemImageRepository;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class ItemImageServiceImpl implements ItemImageService {

    private ItemImageRepository itemImageRepository;

    @Autowired
    public ItemImageServiceImpl(SqlSession sqlSession) {
        this.itemImageRepository = sqlSession.getMapper(ItemImageRepository.class);

        System.out.println("✅ ItemImageService() Created");
    }

    @Override
    public List<ItemImage> findByItemKey(Long itemKey) {
        return itemImageRepository.findByItemKey(itemKey);
    }

    @Override
    public List<ItemImage> findImagesByItemKeys(List<Long> itemKeys) {
        return itemImageRepository.findImagesByItemKeys(itemKeys);
    }

    @Override
    public ItemImage findByUrl(String imgUrl) {
        return itemImageRepository.findByUrl(imgUrl);
    }

    @Override
    public void saveAll(List<ItemImage> imageList) {
        if(imageList == null || imageList.isEmpty()) return;

        Long itemKey = imageList.get(0).getItemKey();

        List<ItemImage> existingImages = itemImageRepository.findByItemKey(itemKey);
        Map<String, ItemImage> existingMap = new HashMap<>();
        for(ItemImage img : existingImages) {
            existingMap.put(img.getImgUrl(), img);
        }

        for (ItemImage img : imageList) {
            String url = img.getImgUrl();

            if(existingMap.containsKey(url)) {
                ItemImage existing = existingMap.get(url);
                if(!Objects.equals(existing.getIsMain(), img.getIsMain())) {
                    itemImageRepository.updateIsMain(url, img.getIsMain());
                }
            } else {
                itemImageRepository.insert(img);
            }
        }
    }

    @Override
    public void deleteImagesByUrls(List<String> imgUrls) {
        if(imgUrls != null && !imgUrls.isEmpty()) {
            itemImageRepository.deleteImagesByUrls(imgUrls);
        }
    }
}
