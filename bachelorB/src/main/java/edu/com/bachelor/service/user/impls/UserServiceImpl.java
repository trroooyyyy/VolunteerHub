package edu.com.bachelor.service.user.impls;

import edu.com.bachelor.model.User;
import edu.com.bachelor.repository.UserRepository;
import edu.com.bachelor.service.user.IUserService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserServiceImpl implements IUserService {
    private UserRepository repository;

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
    public List<User> getAll() {
        return repository.findAll();
    }

    @Override
    public User update(User user) {
        User existingUser = repository.findById(user.getId()).orElseThrow(NoSuchElementException::new);
        existingUser.setLogin(user.getLogin());
        existingUser.setPassword(user.getPassword());
        existingUser.setEmail(user.getEmail());
        existingUser.setRole(user.getRole());
        existingUser.setFirstName(user.getFirstName());
        existingUser.setLastName(user.getLastName());
        existingUser.setAvatarUrl(user.getAvatarUrl());
        existingUser.setCountry(user.getCountry());
        existingUser.setDescription(user.getDescription());
        existingUser.setAge(user.getAge());
        existingUser.setUpdatedAt(LocalDateTime.now());
        return repository.save(existingUser);
    }

    private boolean isLoginPresent(String login){
        return this.getUserByLogin(login).isPresent();
    }

    public Optional<User> getUserByLogin(String login) throws UsernameNotFoundException {
        return repository.findByLogin(login);
    }
}

