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

    private Long itemKey;
    private String addrName;
    private String placeName;
    private String addrDetail;
}
