package com.lec.spring.DTO;

import com.lec.spring.domain.Category;
import com.lec.spring.domain.ItemImage;
import com.lec.spring.domain.Location;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ItemDTO {
    private Long itemKey;
    private String userKey;
    private String useralias;
    private Long cateKey;
    private String subject;
    private String content;
    private Long price;
    private String itemtype;
    private Long purtype;
    private Boolean tradestatus;
    private LocalDateTime writeDate;
    private Long viewcnt;

    private List<LocationDTO> locations;
    private List<ItemImage> images;
}
