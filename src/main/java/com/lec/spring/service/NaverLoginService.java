package com.lec.spring.service;

import com.lec.spring.domain.User;
import com.lec.spring.repository.UserRepository;
import com.lec.spring.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.session.SqlSession;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NaverLoginService {

    private UserRepository userRepository;
    private JwtUtil jwtUtil;

    @Autowired
    public NaverLoginService(SqlSession sqlSession, JwtUtil jwtUtil) {
        this.userRepository = sqlSession.getMapper(UserRepository.class);
        this.jwtUtil = jwtUtil;
    }

    @Value("${naver.client-id}")
    private String clientId;

    @Value("${naver.client-secret}")
    private String clientSecret;

    @Value("${naver.redirect-uri}")
    private String redirectUri;

    public ResponseEntity<?> handleCallback(String code, String state) {
        // 1. access_token 요청
        String accessToken = getAccessToken(code, state);
        if(accessToken == null) {
            return ResponseEntity.badRequest().body("네이버 토큰 요청 실패");
        }

        // 2. 사용자 정보 조회
        JSONObject userInfo = getUserInfo(accessToken);
        if(userInfo == null) {
            return ResponseEntity.badRequest().body("네이버 사용자 정보 요청 실패");
        }

        String email = userInfo.optString("email");
        String name = userInfo.optString("name");
        String naverId = userInfo.optString("id");

        // 3. DB에서 사용자 찾기 / 없으면 회원가입 유도
        Optional<User> optionalUser = userRepository.findByUsernameOrEmail(naverId, email);
        User user;
        if(optionalUser.isPresent()) {  // 사용자가 있으면 담아서 return
            user = optionalUser.get();
        } else {
            // 유저 정보가 없으면 회원가입으로 이동
            return ResponseEntity.ok().body(new JSONObject()
                    .put("registerRequired", true)
                    .put("email", email)
                    .put("name", name)
                    .put("naverId", naverId)
                    .put("accessToken", accessToken)
                    .toString());
        }

        // 4. JWT 발금 및 리다이렉트
        String token = jwtUtil.generateToken(user.getUsername());

        return ResponseEntity.ok().body(new JSONObject()
                .put("token", token)
                .put("accessToken", accessToken)
                .put("useralias", user.getUseralias())
                .toString());
    }

    public void unlink(String accessToken) {
        try {
            String apiURL = "https://nid.naver.com/oauth2.0/token?grant_type=delete&client_id=" + clientId
                    + "&client_secret=" + clientSecret
                    + "&access_token=" + accessToken
                    + "&service_provider=NAVER";

            URL url = new URL(apiURL);
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("GET");

            BufferedReader br = new BufferedReader(new InputStreamReader(
                    con.getResponseCode() == 200 ? con.getInputStream() : con.getErrorStream()
            ));

            StringBuilder response = new StringBuilder();
            String inputLine;
            while ((inputLine = br.readLine()) != null) response.append(inputLine);
            br.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    private String getAccessToken(String code, String state) {
        try {
            String encodedUri = URLEncoder.encode(redirectUri, "UTF-8");
            String apiURL = "https://nid.naver.com/oauth2.0/token"
                    + "?grant_type=authorization_code"
                    + "&client_id=" + clientId
                    + "&client_secret=" + clientSecret
                    + "&redirect_uri=" + encodedUri
                    + "&code=" + code
                    + "&state=" + state;

            URL url = new URL(apiURL);
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("GET");

            BufferedReader br = new BufferedReader(new InputStreamReader(
                    con.getResponseCode() == 200 ? con.getInputStream() : con.getErrorStream()
            ));

            String inputLine;
            StringBuilder response = new StringBuilder();
            while ((inputLine = br.readLine()) != null) response.append(inputLine);
            br.close();

            JSONObject json = new JSONObject(response.toString());
            return json.optString("access_token");

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private JSONObject getUserInfo(String accessToken) {
        try {
            URL url = new URL("https://openapi.naver.com/v1/nid/me");
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("GET");
            con.setRequestProperty("Authorization", "Bearer " + accessToken);

            BufferedReader br = new BufferedReader(new InputStreamReader(
                    con.getResponseCode() == 200 ? con.getInputStream() : con.getErrorStream()
            ));

            String inputLine;
            StringBuilder response = new StringBuilder();
            while ((inputLine = br.readLine()) != null) response.append(inputLine);
            br.close();

            JSONObject json = new JSONObject(response.toString());
            return json.getJSONObject("response");

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
