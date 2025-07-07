package com.lec.spring.service;

import com.lec.spring.domain.User;
import com.lec.spring.repository.UserRepository;
import com.lec.spring.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.session.SqlSession;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class KakaoLoginService {

    private UserRepository userRepository;
    private JwtUtil jwtUtil;

    @Autowired
    public KakaoLoginService(SqlSession sqlSession, JwtUtil jwtUtil) {
        this.userRepository = sqlSession.getMapper(UserRepository.class);
        this.jwtUtil = jwtUtil;
    }

    @Value("${kakao.rest-api-key}")
    private String REST_API_KEY;

    @Value("${kakao.client-secret}")
    private String CLIENT_SECRET;

    @Value("${kakao.redirect-uri}")
    private String redirectUri;

    public ResponseEntity<?> handleCallback(String code) {
        // 1. access_token 요청
        String accessToken = getAccessToken(code);
        if(accessToken == null) {
            return ResponseEntity.badRequest().body("카카오 토큰 요청 실패");
        }

        // 2. 사용자 정보 조회
        JSONObject userInfo = getUserInfo(accessToken);
        if(userInfo == null) {
            return ResponseEntity.badRequest().body("카카오 사용자 정보 요청 실패");
        }

        String email = userInfo.optString("email");
        String name = userInfo.optString("name");
        String kakaoId = userInfo.optString("id");

        // 3. DB에서 사용자 찾기 / 없으면 회원가입 유도
        Optional<User> optionalUser = userRepository.findByUsernameOrEmail(kakaoId, email);
        User user;
        if(optionalUser.isPresent()) {
            user = optionalUser.get();
        } else {
            return ResponseEntity.ok().body(new JSONObject()
                    .put("registerRequired", true)
                    .put("email", email)
                    .put("name", name)
                    .put("kakaoId", kakaoId)
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

    }

    private String getAccessToken(String code) {
        try {
            String encodedUri = URLEncoder.encode(redirectUri, "UTF-8");
            String apiURL = "https://kauth.kakao.com/oauth/token";

            String parameters = "grant_type=authorization_code"
                    + "&client_id=" + REST_API_KEY
                    + "&redirect_uri=" + encodedUri
                    + "&code=" + code
                    + "&client_secret=" + CLIENT_SECRET;

            URL url = new URL(apiURL);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);
            conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

            OutputStreamWriter writer = new OutputStreamWriter(conn.getOutputStream());
            writer.write(parameters);
            writer.flush();
            writer.close();

            BufferedReader br = new BufferedReader(new InputStreamReader(
                    conn.getResponseCode() == 200 ? conn.getInputStream() : conn.getErrorStream()
            ));

            StringBuilder response = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) {
                response.append(line);
            }
            br.close();

            JSONObject json = new JSONObject(response.toString());
            System.out.println("Access Token Response: " + json.toString(2));
            return json.optString("access_token");

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private JSONObject getUserInfo(String accessToken) {
        try {
            URL url = new URL("https://kapi.kakao.com/v2/user/me");
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("GET");
            con.setRequestProperty("Authorization", "Bearer " + accessToken);

            BufferedReader br = new BufferedReader(new InputStreamReader(
                    con.getResponseCode() == 200 ? con.getInputStream() : con.getErrorStream()
            ));

            StringBuilder response = new StringBuilder();
            String inputLine;
            while((inputLine = br.readLine()) != null) response.append(inputLine);
            br.close();

            JSONObject json = new JSONObject(response.toString());
            System.out.println("받아온 JSONObject : " + json);

            JSONObject result = new JSONObject();

            Long id = json.optLong("id", -1);
            result.put("id", String.valueOf(id));

            JSONObject kakaoAccount = json.getJSONObject("kakao_account");
            result.put("email", kakaoAccount.optString("email"));

            JSONObject profile = kakaoAccount.getJSONObject("profile");
            result.put("name", profile.optString("nickname"));

            return result;

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
