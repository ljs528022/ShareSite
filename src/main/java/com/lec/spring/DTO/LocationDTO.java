package com.lec.spring.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LocationDTO {

    private String userKey;     // 장소를 저장한 유저의 키
    private Long itemKey;       // 장소가 등록된 상품의 키
    private String useralias;   // 장소를 저장한 유저의 이름
    private String address;     // 해당 장소의 주소
    private String zoneCode;    // 해당 장소의 구역 번호
    private Boolean main;       // 해당 장소가 대표 장소 인지에 대한 유무
    private String detail;      // 해당 주소의 상세 주소
    private String label;       // 저장한 장소의 별명
}
