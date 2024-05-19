package edu.com.bachelor.controller;

import edu.com.bachelor.model.Association;
import edu.com.bachelor.model.Event;
import edu.com.bachelor.model.User;
import edu.com.bachelor.service.association.impls.AssociationServiceImpl;
import edu.com.bachelor.service.event.impls.EventServiceImpl;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/event")
@AllArgsConstructor
public class EventController {
    private final EventServiceImpl service;
    private final AssociationServiceImpl associationService;

    @GetMapping("/")
    public ResponseEntity<Page<Event>> getAllEvents(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "6") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return new ResponseEntity<>(service.getAll(pageable), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable("id") Long id) {
        return new ResponseEntity<>(service.getOneById(id), HttpStatus.OK);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteEvent(@PathVariable("id") Long id) {
        service.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/")
    public ResponseEntity<Event> updateEvent(@Valid @RequestBody Event event) {
        return new ResponseEntity<>(service.update(event), HttpStatus.OK);
    }
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @PostMapping("/")
    public ResponseEntity<Event> saveEvent(@RequestBody Event event)  {
        Association association = event.getAssociation();

        List<User> associationUsers = associationService.getUsersByAssociationId(association.getId());

        event.getUsers().addAll(associationUsers);

        Event savedEvent = service.save(event);

        if(savedEvent==null){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(savedEvent, HttpStatus.OK);
    }
}