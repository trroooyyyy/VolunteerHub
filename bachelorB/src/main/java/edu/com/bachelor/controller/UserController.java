package edu.com.bachelor.controller;

import edu.com.bachelor.model.User;
import edu.com.bachelor.service.user.impls.UserServiceImpl;
import edu.com.bachelor.token.TokenService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@AllArgsConstructor
public class UserController {
    private final UserServiceImpl service;
    private final TokenService tokenService;

    @GetMapping("/")
    public ResponseEntity<Page<User>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) String login,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String telephone) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = service.searchUsers(login, email, telephone, pageable);
        return new ResponseEntity<>(users, HttpStatus.OK);
    }


    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") Long id) {
        return new ResponseEntity<>(service.getOneById(id), HttpStatus.OK);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteUser(@PathVariable("id") Long id) {
        tokenService.deleteAllTokensByUser(id);
        service.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @Valid @RequestBody User user, @RequestHeader("Authorization") String tokenHeader) {
        String jwt = tokenHeader.substring(7);

        Optional<User> userOptional = tokenService.getUserByToken(jwt);
        if (userOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        User existingUser = service.getOneById(id);
        if (existingUser == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        if (!userOptional.get().getRole().name().equals("ROLE_ADMIN")) {
            if (!userOptional.get().getId().equals(existingUser.getId())) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
        }

        user.setId(id);
        User updatedUser = service.update(user);
        if (updatedUser != null) {
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/")
    public ResponseEntity<User> saveUser(@RequestBody User user)  {
        User savedUser = service.save(user);
        if(savedUser==null){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(savedUser, HttpStatus.OK);
    }
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/hello/user")
    String sayHelloUser() {
        return "Hello user!!!";
    }

    @GetMapping("/hello")
    String sayHelloAnonymous() {
        return "Hello anonymous!!!";
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/t")
    public ResponseEntity<User> getCurrentUser(@RequestHeader("Authorization") String tokenHeader) {
        String jwt = tokenHeader.substring(7);

        Optional<User> userOptional = tokenService.getUserByToken(jwt);
        return userOptional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }




}
