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

    void insertAll(List<LocationDTO> locationDTO);

    void deleteAll(List<LocationDTO> locationDTO);

    // Delete Location
    int deleteLocation(@Param("address")String address);

    int checkSameLocation(@Param("address")String address, @Param("userKey")String userKey);

    // Find Location By UserKey
    List<Location> findLocationByUserKey(@Param("userKey")String userKey);

    List<LocationDTO> findByUserKeyAndItemKey(@Param("userKey")String userKey,
                                              @Param("itemKey")Long itemKey);

    List<LocationDTO> findLocationsByItemKeys(List<Long> itemKeys);

    void resetAllMainLocations(@Param("userKey")String userKey);

    void setMainLocationByKey(@Param("userKey")String userKey,
                              @Param("address")String address);
}
