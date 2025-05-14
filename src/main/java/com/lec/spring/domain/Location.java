package com.lec.spring.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Location {

    private String userKey;     // user's PK (FK)
    private Long itemKey;       // item's PK (FK)
    private String useralias;   // 장소를 저장한 유저의 이름
    private String address;     // 해당 장소의 주소
    private String zoneCode;    // 해당 장소의 구역 번호
    private String detail;      // 해당 주소의 상세 주소
    private String label;       // 저장한 장소의 별명

}
