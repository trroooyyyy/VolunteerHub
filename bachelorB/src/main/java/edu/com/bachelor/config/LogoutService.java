package edu.com.bachelor.config;


import edu.com.bachelor.token.Token;
import edu.com.bachelor.token.TokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class LogoutService implements LogoutHandler {
    private final TokenService tokenService;

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        final String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            return;
        }
        final String jwt = header.substring(7);
        Token activeToken = tokenService.getByJwt(jwt).orElse(null);
        if (activeToken != null) {
            activeToken.setRevoked(true);
            tokenService.update(activeToken);
        }

    }
}
