package edu.com.bachelor.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {
    private static final String secretKey
            = "99999029f3854e50d82c7a7bd9c8440e6c13c380d8a50d9fd16789605fb562e4";

    private Key getSignedKey() {
        byte[] keyInBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyInBytes);
    }
    public String generateJwt(UserDetails user) {
        return this.generateJwt(new HashMap<>(), user);
    }

    public String generateJwt(Map<String, Object> additionalClaims, UserDetails user) {
        return Jwts.builder()
                .setClaims(additionalClaims)
                .setSubject(user.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis()+1000*60*60))
                .signWith(getSignedKey(), SignatureAlgorithm.HS256).compact();
    }

    public String extractLogin(String jwt) {
        return this.extractOneClaim(jwt, Claims::getSubject);
    }

    private Claims extractAllClaims(String jwt) {
        return Jwts.parserBuilder()
                .setSigningKey(this.getSignedKey())
                .build()
                .parseClaimsJws(jwt)
                .getBody();
    }

    private <T> T extractOneClaim(String jwt, Function<Claims, T> resolver) {
        final Claims claims = this.extractAllClaims(jwt);
        return resolver.apply(claims);
    }

    public boolean isJwtValid(String jwt, UserDetails userDetails) {
        String username = this.extractLogin(jwt);
        return (username.equals(userDetails.getUsername()));
    }

    private boolean isJwtExpired(String jwt) {
        return this.getExpirationDate(jwt).before(new Date());
    }

    private Date getExpirationDate(String jwt) {
        return this.extractOneClaim(jwt, Claims::getExpiration);
    }
}
