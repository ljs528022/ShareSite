package com.lec.spring.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret-key}")
    private String secretKeyPlain;
    private Key secretKey;
    private final long EXPIRATION_TIME = 1000 * 60 * 60 * 10;   // 10 Hours
//    private final long EXPIRATION_TIME = 1000 * 60 * 5;   // 테스트 용 5분


    @PostConstruct
    protected void init() {
        this.secretKey = Keys.hmacShaKeyFor(secretKeyPlain.getBytes());
    }

    public String generateToken(String username) {
        return buildToken(username, EXPIRATION_TIME);
    }

    public String generateRefreshToken(String username) {
        return buildToken(username, EXPIRATION_TIME);
    }

    public String getUsernameFromToken(String token) {
        return parseToken(token).getBody().getSubject();
    }

    public boolean validateToken(String token, UserDetails userDetails){
        Claims claims = parseToken(token).getBody();
        String username = claims.getSubject();
        return username.equals(userDetails.getUsername()) && !isTokenExpired(claims);
    }

    private boolean isTokenExpired(Claims claims) {
        return claims.getExpiration().before(new Date());
    }

    private Jws<Claims> parseToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token);
    }

    public Claims getClaims(String token) {
        return parseToken(token).getBody();
    }

    private String buildToken(String username, long duration) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + EXPIRATION_TIME);

        System.out.println("토큰 생성 시간: " + now);
        System.out.println("토큰 만료 시간: " + expiry);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }
}
