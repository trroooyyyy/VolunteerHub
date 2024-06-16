package edu.com.bachelor.service.user.impls;

import edu.com.bachelor.model.User;
import edu.com.bachelor.repository.UserRepository;
import edu.com.bachelor.service.user.IUserService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.swing.text.html.Option;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserServiceImpl implements IUserService {
    private UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public User save(User user) {
        if (user.getId() != null) {
            return null;
        }
        if (isLoginPresent(user.getLogin())) {
            return null;
        }
        if (isEmailPresent(user.getEmail())) {
            return null;
        }
 
        user.setCreatedAt(LocalDateTime.now());
        return repository.save(user);
    }
    private boolean isEmailPresent(String email) {
        return this.getUserByEmail(email).isPresent();
    }

    public Optional<User> getUserByEmail(String email) {
        return repository.findByEmail(email);
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Override
    public User getOneById(Long id) {
        return repository.findById(id).orElseThrow(NoSuchElementException::new);
    }

    @Override
    public Page<User> getAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Override
    public User update(User user) {
        User existingUser = repository.findById(user.getId()).orElseThrow(NoSuchElementException::new);

        if (!existingUser.getLogin().equals(user.getLogin()) && isLoginPresent(user.getLogin())) {
            throw new IllegalArgumentException("Login is already in use");
        }

        existingUser.setLogin(user.getLogin());
        existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
        existingUser.setEmail(user.getEmail());
        existingUser.setFirstName(user.getFirstName());
        existingUser.setLastName(user.getLastName());
        existingUser.setAvatarUrl(user.getAvatarUrl());
        existingUser.setCountry(user.getCountry());
        existingUser.setDescription(user.getDescription());
        existingUser.setAge(user.getAge());
        existingUser.setTelephone(user.getTelephone());
        existingUser.setInstagram(user.getInstagram());
        existingUser.setTelegram(user.getTelegram());
        existingUser.setFacebook(user.getFacebook());
        existingUser.setUpdatedAt(LocalDateTime.now());
        return repository.save(existingUser);
    }



    private boolean isLoginPresent(String login){
        return this.getUserByLogin(login).isPresent();
    }

    public Optional<User> getUserByLogin(String login) throws UsernameNotFoundException {
        return repository.findByLogin(login);
    }
    public Page<User> searchUsers(String login, String email, String telephone, Pageable pageable) {
        if (login != null && !login.isEmpty() && email != null && !email.isEmpty() && telephone != null && !telephone.isEmpty()) {
            return repository.findByLoginContainingAndEmailContainingAndTelephoneContaining(login, email, telephone, pageable);
        } else if (login != null && !login.isEmpty() && email != null && !email.isEmpty()) {
            return repository.findByLoginContainingAndEmailContaining(login, email, pageable);
        } else if (login != null && !login.isEmpty() && telephone != null && !telephone.isEmpty()) {
            return repository.findByLoginContainingAndTelephoneContaining(login, telephone, pageable);
        } else if (email != null && !email.isEmpty() && telephone != null && !telephone.isEmpty()) {
            return repository.findByEmailContainingAndTelephoneContaining(email, telephone, pageable);
        } else if (login != null && !login.isEmpty()) {
            return repository.findByLoginContaining(login, pageable);
        } else if (email != null && !email.isEmpty()) {
            return repository.findByEmailContaining(email, pageable);
        } else if (telephone != null && !telephone.isEmpty()) {
            return repository.findByTelephoneContaining(telephone, pageable);
        } else {
            return repository.findAll(pageable);
        }
    }

    @Transactional
    public void uploadAvatar(Long userId, MultipartFile file) throws IOException {
        User user = repository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        user.setAvatarUrl(file.getBytes());
        repository.save(user);
    }


}

