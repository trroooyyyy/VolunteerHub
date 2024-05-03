package edu.com.bachelor.auth;


import edu.com.bachelor.jwt.JwtService;
import edu.com.bachelor.model.Role;
import edu.com.bachelor.model.User;
import edu.com.bachelor.service.user.impls.UserServiceImpl;
import edu.com.bachelor.token.Token;
import edu.com.bachelor.token.TokenService;
import edu.com.bachelor.token.TokenType;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;
    private final UserServiceImpl userService;
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder;
    public AuthenticationResponse register(RegistrationRequest request){
        User user = User.builder()
                .login(request.getLogin())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .age(request.getAge())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .country(request.getCountry())
                .telephone(request.getTelephone())
                .role(Role.ROLE_USER)
                .build();
        User userRecorded = userService.save(user);
        if (userRecorded == null) {
            return AuthenticationResponse.builder()
                    .token(" Persistence failed ")
                    .build();
        }
        String jwt = jwtService.generateJwt(user);
        Token token = Token.builder()
                .user(userRecorded)
                .jwt(jwt)
                .type(TokenType.BEARER)
                .revoked(false)
                .build();
        tokenService.record(token);
        return AuthenticationResponse.builder()
                .token(jwt)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request){
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getLogin(),
                        request.getPassword()
                )
        );
        // var user = userDetailsService.loadUserByUsername(request.getLogin());
        User userExtracted = userService.getUserByLogin(request.getLogin()).orElseThrow();
        String jwt = jwtService.generateJwt(userExtracted);
        Token token = Token.builder()
                .user(userExtracted)
                .jwt(jwt)
                .type(TokenType.BEARER)
                .revoked(false)
                .build();
        revokeAllTokensByUser(userExtracted);
        tokenService.record(token);
        return AuthenticationResponse.builder()
                .token(jwt)
                .build();
    }

    private void revokeAllTokensByUser(User user) {
        List<Token> allValidTokensByUser = tokenService.getAllValidTokensByUser(user);
        if (allValidTokensByUser.isEmpty()) {
            return;
        }
        allValidTokensByUser.forEach(token -> token.setRevoked(true));
        tokenService.recordAll(allValidTokensByUser);
    }
}
