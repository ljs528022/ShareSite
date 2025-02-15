package com.lec.spring.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Like {

    private Long id;        // PK
    private Long user_id;   // User ID(FK)
    private Long post_id;   // Post ID(FK)
    private boolean state;  // 0: UnChecked, 1: Checked

    private User user;
    private Post post;

}
