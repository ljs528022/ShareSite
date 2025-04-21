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

    private String userKey;         // user's PK (FK)
    private String addrName;        // Address Name
    private String placeName;       // Location's Name
    private String addrDetail;      // Detail Address


}
