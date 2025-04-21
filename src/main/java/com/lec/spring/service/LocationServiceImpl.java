package com.lec.spring.service;

import com.lec.spring.domain.Location;
import com.lec.spring.domain.User;
import com.lec.spring.repository.LocationRepository;
import com.lec.spring.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class LocationServiceImpl implements LocationService {

    private LocationRepository locationRepository;


    @Override
    public int saveLocation(Location location) {
        return locationRepository.saveLocation(location);
    }

    @Override
    public Location findLocationByUserKey(String userKey) {
        return locationRepository.findLocationByUserKey(userKey);
    }
}
