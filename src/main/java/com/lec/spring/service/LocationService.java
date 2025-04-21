package com.lec.spring.service;

import com.lec.spring.domain.Location;

public interface LocationService {

    int saveLocation(Location location);

    Location findLocationByUserKey(String userKey);
}
