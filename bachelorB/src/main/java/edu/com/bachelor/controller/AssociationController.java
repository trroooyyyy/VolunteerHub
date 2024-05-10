package edu.com.bachelor.controller;

import edu.com.bachelor.model.Association;
import edu.com.bachelor.service.association.impls.AssociationServiceImpl;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/association")
@AllArgsConstructor
public class AssociationController {
    private final AssociationServiceImpl service;

    @GetMapping("/")
    public ResponseEntity<List<Association>> getAllAssociations() {
        return new ResponseEntity<>(service.getAll(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Association> getAssociationById(@PathVariable("id") Long id) {
        return new ResponseEntity<>(service.getOneById(id), HttpStatus.OK);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteAssociation(@PathVariable("id") Long id) {
        service.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/")
    public ResponseEntity<Association> updateAssociation(@Valid @RequestBody Association association) {
        return new ResponseEntity<>(service.update(association), HttpStatus.OK);
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
}