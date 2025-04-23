package com.lec.spring.service;

import com.lec.spring.DTO.LocationDTO;
import com.lec.spring.domain.Location;

import java.util.List;

public interface LocationService {

    int saveLocation(Location location);

    Location findLocationByUserKey(String userKey);

    List<LocationDTO> findByUserKeyAndItemKey(String userKey, Long itemKey);
}
