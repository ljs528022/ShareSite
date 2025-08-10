package com.lec.spring.controller;

import com.lec.spring.DTO.ItemDTO;
import com.lec.spring.DTO.LoginRequest;
import com.lec.spring.DTO.UserModifyRequest;
import com.lec.spring.domain.Item;
import com.lec.spring.domain.Notice;
import com.lec.spring.domain.Report;
import com.lec.spring.domain.User;
import com.lec.spring.service.ItemService;
import com.lec.spring.service.NoticeService;
import com.lec.spring.service.ReportService;
import com.lec.spring.service.UserService;
import org.apache.ibatis.annotations.Delete;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5178/")
public class AdminController {

    @Autowired
    private UserService userService;
    @Autowired
    private ItemService itemService;
    @Autowired
    private ReportService reportService;

    @Autowired
    private NoticeService noticeService;

    @PostMapping("/login")
    public ResponseEntity<?> loginAdmin(@RequestBody LoginRequest request) {
        User user = userService.findByUserName(request.getUsername());

        if(!user.getAuth().equals("ADMIN")) {
            return ResponseEntity.badRequest().build();
        }

        String token = userService.login(request);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/dashboard")
    public Map<String, Object> getStats() {
        List<User> users = userService.findAll();
        List<ItemDTO> items = itemService.findAllItem();
        List<Report> reports = reportService.findAll();

        Map<String, Object> response = new HashMap<>();
        response.put("users", users.size());
        response.put("items", items.size());
        response.put("reports", reports.size());
        response.put("latestItems", items.subList(0, Math.min(items.size(), 5)));
        response.put("latestReports", reports.subList(0, Math.min(reports.size(), 5)));

        return response;
    }

    // ---- Notice 부분 ---------------------------------
    @GetMapping("/notices")
    public Map<String, Object> getNotices() {
        List<Notice> allNotices = noticeService.findAll();

        Map<String, Object> response = new HashMap<>();
        response.put("data", allNotices);
        response.put("count", allNotices.size());

        return response;
    }

    @PostMapping("/notices")
    public Map<String, Object> addNotices(@RequestBody Map<String, String> data) {


        Map<String, Object> response = new HashMap<>();


        return response;
    }


    // ---- User 부분 -----------------------------------
    @GetMapping("/users")
    public Map<String, Object> getUsers() {
        List<User> allUsers = userService.findAll();

        Map<String, Object> response = new HashMap<>();
        response.put("data", allUsers);
        response.put("count", allUsers.size());

        return response;
    }

    @GetMapping("/users/{id}")
    public Map<String, Object> getOneUser(@PathVariable("id")String id) {
        User user = userService.findByUserName(id);

        Map<String, Object> response = new HashMap<>();
        response.put("data", user);

        return response;
    }

    @PostMapping("/users/{id}")
    public Map<String, Object> updateUser(@PathVariable("id")String id, @RequestBody Map<String, String> data) {
        User existingUser = userService.findByUserName(id);
        String useralias = data.get("useralias");
        String userIntro = data.get("userIntro");
        String email = data.get("email");
        String auth = data.get("auth");
        String state = data.get("state");

        if(existingUser == null) {
            return null;
        }

        System.out.println("===========================");
        System.out.println("요청된 유저 : " + existingUser);
        System.out.println("===========================");

        User editedUser = User.builder()
                .userKey(existingUser.getUserKey())
                .username(existingUser.getUsername())
                .password(existingUser.getPassword())
                .useralias(useralias)
                .email(email)
                .regtype(existingUser.getRegtype())
                .userimg(existingUser.getUserimg())
                .state(state)
                .regDate(existingUser.getRegDate())
                .visitcnt(existingUser.getVisitcnt())
                .tradecnt(existingUser.getTradecnt())
                .userIntro(userIntro)
                .editedDate(existingUser.getEditedDate())
                .auth(auth)
                .build();

        userService.modify(editedUser);

        Map<String, Object> response = new HashMap<>();
        response.put("data", editedUser);

        return response;
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable("id")String id) {
        User existinUser  = userService.findByUserName(id);
        String userKey = existinUser.getUserKey();

        userService.withdrawUser(userKey);
    }

    // ---- Item 부분 -----------------------------------
    @GetMapping("/items")
    public Map<String, Object> getItems() {
        List<ItemDTO> items = itemService.findAllItem();

        Map<String, Object> response = new HashMap<>();
        response.put("data", items);
        response.put("count", items.size());

        return response;
    }

    @PostMapping("/items/{id}")
    public Map<String, Object> updateItem(@PathVariable("id")Long id, @RequestBody Map<String, String> data) {
        ItemDTO existingItem = itemService.findByItemKey(id);
        String subject = data.get("subject");
        String content = data.get("content");

        if(existingItem == null) {
            return null;
        }

        Item editedItem = Item.builder()
                .itemKey(existingItem.getItemKey())
                .userKey(existingItem.getUserKey())
                .cateKey(existingItem.getCateKey())
                .subject(subject)
                .content(content)
                .price(existingItem.getPrice())
                .itemtype(existingItem.getItemtype())
                .purtype(existingItem.getPurtype())
                .tradestatus(existingItem.getTradestatus())
                .writeDate(existingItem.getWriteDate())
                .viewcnt(existingItem.getViewcnt())
                .build();

        itemService.modify(editedItem);

        Map<String, Object> response = new HashMap<>();
        response.put("data", editedItem);

        return response;
    }

    @DeleteMapping("/items/{id}")
    public void deleteItem(@PathVariable("id")Long id) {
        ItemDTO existingItem = itemService.findByItemKey(id);

        if (existingItem != null) itemService.delete(id);
    }

    // ---- Report 부분 -----------------------------------
    @GetMapping("/reports")
    public Map<String, Object> getReports() {
        List<Report> reports = reportService.findAll();

        Map<String, Object> response = new HashMap<>();
        response.put("data", reports);
        response.put("count", reports.size());

        return response;
    }
}
