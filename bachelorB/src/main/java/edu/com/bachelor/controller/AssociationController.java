package edu.com.bachelor.controller;

import edu.com.bachelor.model.Association;
import edu.com.bachelor.model.User;
import edu.com.bachelor.service.association.impls.AssociationServiceImpl;
import edu.com.bachelor.service.user.impls.UserServiceImpl;
import edu.com.bachelor.token.TokenService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/association")
@AllArgsConstructor
public class AssociationController {
    private final AssociationServiceImpl service;
    private final TokenService tokenService;
    private final UserServiceImpl userService;

    @GetMapping("/")
    public ResponseEntity<List<Association>> getAllAssociations() {
        return new ResponseEntity<>(service.getAll(), HttpStatus.OK);
    }

    @GetMapping("/{id}/users")
    public ResponseEntity<List<User>> getUsersByAssociationId(@PathVariable("id") Long associationId) {
        List<User> users = service.getUsersByAssociationId(associationId);
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Association> getAssociationById(@PathVariable("id") Long id) {
        return new ResponseEntity<>(service.getOneById(id), HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteAssociation(@PathVariable Long id, @RequestHeader("Authorization") String tokenHeader) {
        String jwt = tokenHeader.substring(7);

        Optional<User> userOptional = tokenService.getUserByToken(jwt);
        if (userOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        Association existingAssociation = service.getOneById(id);
        if (existingAssociation == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        if (!userOptional.get().getRole().name().equals("ROLE_ADMIN")) {
            if (!userOptional.get().getId().equals(existingAssociation.getOwner().getId())) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
        }

        service.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Association> updateAssociation(@PathVariable Long id, @Valid @RequestBody Association association, @RequestHeader("Authorization") String tokenHeader) {
        String jwt = tokenHeader.substring(7);

        Optional<User> userOptional = tokenService.getUserByToken(jwt);
        if (userOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        Association existingAssociation = service.getOneById(id);
        if (existingAssociation == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        User currentUser = userOptional.get();
        if (!currentUser.getRole().name().equals("ROLE_ADMIN")) {
            if (!currentUser.getId().equals(existingAssociation.getOwner().getId())) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
        }

        association.setId(id);
        Association updatedAssociation = service.update(association);
        if (updatedAssociation != null) {
            return new ResponseEntity<>(updatedAssociation, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @PostMapping("/")
    public ResponseEntity<Association> saveAssociation(@RequestBody Association association)  {
        Association savedAssociation = service.save(association);
        if(savedAssociation==null){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(savedAssociation, HttpStatus.OK);
    }
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @PostMapping("/{id}/join")
    public ResponseEntity<Association> joinAssociation(@PathVariable("id") Long id, @RequestBody User user) {
        Association association = service.getOneById(id);
        association.getUsers().add(user);
        Association updatedAssociation = service.update(association);
        return new ResponseEntity<>(updatedAssociation, HttpStatus.OK);
    }
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @PostMapping("/{id}/exit")
    public ResponseEntity<Association> exitAssociation(@PathVariable("id") Long id, @RequestBody User user) {
        Association association = service.getOneById(id);
        if (association.getOwner().getId().equals(user.getId())) {
            service.delete(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            association.getUsers().removeIf(u -> u.getId().equals(user.getId()));
            if (association.getUsers().isEmpty()) {
                service.delete(id);
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
                Association updatedAssociation = service.update(association);
                return new ResponseEntity<>(updatedAssociation, HttpStatus.OK);
            }
        }
    }
    @DeleteMapping("/{id}/user/{userId}")
    public ResponseEntity<HttpStatus> deleteUserFromAssociation(@PathVariable Long id, @PathVariable Long userId, @RequestHeader("Authorization") String tokenHeader) {
        String jwt = tokenHeader.substring(7);

        Optional<User> userOptional = tokenService.getUserByToken(jwt);
        if (userOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        Association existingAssociation = service.getOneById(id);
        if (existingAssociation == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        if (!userOptional.get().getRole().name().equals("ROLE_ADMIN")) {
            if (!userOptional.get().getId().equals(existingAssociation.getOwner().getId())) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
        }


        User userToDelete = userService.getOneById(userId);
        if (userToDelete == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        existingAssociation.getUsers().removeIf(u -> u.getId().equals(userToDelete.getId()));
        service.update(existingAssociation);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<Association>> getAssociationsByOwnerId(@PathVariable Long ownerId) {
        List<Association> associations = service.getAssociationsByOwnerId(ownerId);
        return new ResponseEntity<>(associations, HttpStatus.OK);
    }


}