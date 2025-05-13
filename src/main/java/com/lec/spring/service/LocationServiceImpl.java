package com.lec.spring.service;

import com.lec.spring.DTO.LocationDTO;
import com.lec.spring.domain.Location;
import com.lec.spring.domain.User;
import com.lec.spring.repository.LocationRepository;
import com.lec.spring.repository.UserRepository;
import jakarta.persistence.PreUpdate;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationServiceImpl implements LocationService {

    private LocationRepository locationRepository;

    @Autowired
    public LocationServiceImpl(SqlSession sqlSession) {
        this.locationRepository = sqlSession.getMapper(LocationRepository.class);

        System.out.println("✅ LocationService() Created");
    }


    @Override
    public int saveLocation(Location location) {
        return locationRepository.saveLocation(location);
    }

    @Override
    public int deleteLocation(String address) {
        return locationRepository.deleteLocation(address);
    }

    @Override
    public boolean checkSameLocation(String address, String userKey) {
        return locationRepository.checkSameLocation(address, userKey) > 0;
    }

    @Override
    public List<Location> findLocationByUserKey(String userKey) {
        return locationRepository.findLocationByUserKey(userKey);
    }

    @Override
    public List<LocationDTO> findByUserKeyAndItemKey(String userKey, Long itemKey) {
        return locationRepository.findByUserKeyAndItemKey(userKey, itemKey);
    }
}
