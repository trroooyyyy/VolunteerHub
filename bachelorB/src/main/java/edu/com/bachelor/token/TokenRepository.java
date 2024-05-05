package edu.com.bachelor.token;

import edu.com.bachelor.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Long> {
    List<Token> findTokensByUser(User user);
    Optional<Token> findByJwt(String jwt);

    void deleteByUserId(Long userId);
}