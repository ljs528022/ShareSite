package com.lec.spring.repository;

import com.lec.spring.domain.Location;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface LocationRepository {

    // Save Location
    int saveLocation(Location location);

    // Find Location By UserKey
    Location findLocationByUserKey(String userKey);
}
