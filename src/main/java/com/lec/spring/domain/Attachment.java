package com.lec.spring.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Attachment {

    private Long id;            // PK
    private Long post_id;       // Post ID (FK)
    private String sourcename;
    private String filename;
}
