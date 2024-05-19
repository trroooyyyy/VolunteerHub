package edu.com.bachelor.repository;

import edu.com.bachelor.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByLogin(String login);

    Optional<User> findByEmail(String email);

    Page<User> findByLoginContaining(String login, Pageable pageable);

    Page<User> findByEmailContaining(String email, Pageable pageable);

    Page<User> findByTelephoneContaining(String telephone, Pageable pageable);

    Page<User> findByLoginContainingAndEmailContainingAndTelephoneContaining(String login, String email, String telephone, Pageable pageable);

    Page<User> findByLoginContainingAndEmailContaining(String login, String email, Pageable pageable);

    Page<User> findByLoginContainingAndTelephoneContaining(String login, String telephone, Pageable pageable);

    Page<User> findByEmailContainingAndTelephoneContaining(String email, String telephone, Pageable pageable);
}