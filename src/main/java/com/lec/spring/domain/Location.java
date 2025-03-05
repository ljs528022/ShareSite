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

    private Long userKey;       // user's PK (FK)
    private Long zipcode;       // Address Number
    private String addr;        // Address
    private String addrDetail;  // Detail Address


}
