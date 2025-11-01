package com.lec.spring.controller;

import com.lec.spring.DTO.LocationDTO;
import com.lec.spring.domain.Location;
import com.lec.spring.service.ItemService;
import com.lec.spring.service.LocationService;
import com.lec.spring.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5178")
public class LocationController {

    @Autowired
    private LocationService locationService;
    @Autowired
    private ItemService itemService;
    @Autowired
    private UserService userService;

    @PostMapping("/user/location")
    public ResponseEntity<?> addLocation(@RequestBody LocationDTO locationDTO) {
        Location location = Location.builder()
                .userKey(locationDTO.getUserKey())
                .useralias(locationDTO.getUseralias())
                .address(locationDTO.getAddress())
                .zoneCode(locationDTO.getZoneCode())
                .main(locationDTO.getMain())
                .detail(locationDTO.getDetail())
                .label(locationDTO.getLabel())
                .build();

        boolean checkSameAddress = locationService.checkSameLocation(location.getAddress(), location.getUserKey());
        if(checkSameAddress == true) {
            return ResponseEntity.badRequest().body("이미 존재하는 주소 입니다!");
        } else {
            locationService.saveLocation(location);
            return ResponseEntity.ok("동록 성공!");
        }
    }

    @GetMapping("/location/{userKey}")
    public ResponseEntity<?> getUserLocations(@PathVariable("userKey")String userKey) {
        if(userKey != null) {
            List<Location> locations = locationService.findLocationByUserKey(userKey);
            return ResponseEntity.ok(locations);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/location/set-main")
    public ResponseEntity<?> setMainLocation(@RequestBody LocationDTO locationDTO) {
        int result = locationService.updateMainLocation(locationDTO);

        if(result < 1) {
            return ResponseEntity.badRequest().body("수정 실패...");
        } else return ResponseEntity.ok("수정 성공!");
    }

    @PostMapping("/location/delete")
    public ResponseEntity<?> deleteLocation(@RequestBody LocationDTO locationDTO) {
        String address = locationDTO.getAddress();

        if(address.isEmpty()) {
            return ResponseEntity.badRequest().body("삭제할 주소가 존재하지 않습니다");
        }
        locationService.deleteLocation(address);

        return ResponseEntity.ok("삭제 성공!");
    }

}
