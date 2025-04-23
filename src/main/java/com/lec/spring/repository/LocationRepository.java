package com.lec.spring.repository;

import com.lec.spring.DTO.LocationDTO;
import com.lec.spring.domain.Location;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface LocationRepository {

    // Save Location
    int saveLocation(Location location);

    // Find Location By UserKey
    Location findLocationByUserKey(String userKey);

    List<LocationDTO> findByUserKeyAndItemKey(String userKey, Long itemKey);
}
