package com.lec.spring.service;

import com.lec.spring.DTO.LocationDTO;
import com.lec.spring.domain.Location;

import java.util.List;

public interface LocationService {

    int saveLocation(Location location);

    void updateLocation(Long itemKey, String userKey, List<LocationDTO> location);

    int updateMainLocation(LocationDTO locationDTO);

    int deleteLocation(String address);

    boolean checkSameLocation(String address, String userKey);

    List<Location> findLocationByUserKey(String userKey);

    List<LocationDTO> findByUserKeyAndItemKey(String userKey, Long itemKey);


}
