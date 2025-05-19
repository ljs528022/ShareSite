package com.lec.spring.service;

import com.lec.spring.DTO.LocationDTO;
import com.lec.spring.domain.Location;
import com.lec.spring.repository.LocationRepository;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

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
    public void updateLocation(Long itemKey, String userKey, List<LocationDTO> location) {
        List<LocationDTO> existing = locationRepository.findByUserKeyAndItemKey(userKey, itemKey);

        List<LocationDTO> incoming = location.stream()
                .map(dto -> LocationDTO.builder()
                        .userKey(userKey)
                        .itemKey(itemKey)
                        .useralias(dto.getUseralias())
                        .address(dto.getAddress())
                        .zoneCode(dto.getZoneCode())
                        .build())
                .toList();

        List<LocationDTO> toDelete = existing.stream()
                .filter(ex -> incoming.stream().noneMatch(in -> isSameLocation(ex, in)))
                .toList();

        List<LocationDTO> toInsert = incoming.stream()
                .filter(in -> existing.stream().noneMatch(ex -> isSameLocation(ex, in)))
                .toList();

        System.out.println("추가해야 할 장소 : " + toInsert);

        if(!toDelete.isEmpty()) locationRepository.deleteAll(toDelete);
        if(!toInsert.isEmpty()) locationRepository.insertAll(toInsert);
    }

    @Override
    public int updateMainLocation(LocationDTO locationDTO) {
        if (locationDTO == null) return 0;
        locationRepository.resetAllMainLocations(locationDTO.getUserKey());
        locationRepository.setMainLocationByKey(locationDTO.getUserKey(), locationDTO.getAddress());
        return 1;
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

    // 장소 비교를 위한 로직
    private boolean isSameLocation(LocationDTO a, LocationDTO b) {
        return a.getItemKey().equals(b.getItemKey())
                && a.getAddress().equals(b.getAddress())
                && a.getZoneCode().equals(b.getZoneCode())
                && Objects.equals(a.getUseralias(), b.getUseralias());
    }
}
