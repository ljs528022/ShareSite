package com.lec.spring.config;

import com.lec.spring.service.CustomUserDetailsService;
import com.lec.spring.util.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private JwtUtil jwtUtil;
    private CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, CustomUserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();

        if(path.startsWith("/uploads")
            || path.startsWith("/user/login")
            || path.startsWith("/oauth")
            || path.startsWith("/home")
            || path.startsWith("/category")
            || path.startsWith("/error")
            || path.startsWith("/product")
            || path.startsWith("/notice")
            || path.startsWith("/chat")
            || path.startsWith("/report")) {
                
            filterChain.doFilter(request, response);
            return;
        }

        String authHerder = request.getHeader("Authorization");

        if(authHerder != null && authHerder.startsWith("Bearer ")) {
            String token = authHerder.substring(7);
            Claims claims = jwtUtil.getClaims(token);

            if(claims != null && SecurityContextHolder .getContext().getAuthentication() == null) {
                String username = claims.getSubject();

                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                if(jwtUtil.validateToken(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}
