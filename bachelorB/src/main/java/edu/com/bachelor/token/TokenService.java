package edu.com.bachelor.token;

import edu.com.bachelor.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TokenService {
    private final TokenRepository repository;

    public Token record(Token token){
        return repository.save(token);
    }

    public Token update(Token token) { return repository.save(token); }

    public List<Token> getAllValidTokensByUser(User user){
        return repository.findTokensByUser(user).stream().filter(token -> !token.isRevoked()).toList();

    }

    public Optional<Token> getByJwt(String jwt){
        return repository.findByJwt(jwt);
    }

    public void recordAll(List<Token> tokens) {
        repository.saveAll(tokens);
    }
}
