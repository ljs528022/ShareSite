package com.lec.spring.repository;

import com.lec.spring.DTO.LocationDTO;
import com.lec.spring.domain.Location;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface LocationRepository {

    // Save Location
    int saveLocation(Location location);

    // Find Location By UserKey
    Location findLocationByUserKey(@Param("userKey")String userKey);

    List<LocationDTO> findByUserKeyAndItemKey(@Param("userKey")String userKey,
                                              @Param("itemKey")Long itemKey);

    List<LocationDTO> findLocationsByItemKeys(List<Long> itemKeys);
}
