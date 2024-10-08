package edu.com.bachelor.controller;

import edu.com.bachelor.model.Association;
import edu.com.bachelor.model.Event;
import edu.com.bachelor.model.User;
import edu.com.bachelor.service.association.impls.AssociationServiceImpl;
import edu.com.bachelor.service.event.impls.EventServiceImpl;
import edu.com.bachelor.service.review.impls.ReviewServiceImpl;
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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/event")
@AllArgsConstructor
public class EventController {
    private final EventServiceImpl service;
    private final AssociationServiceImpl associationService;
    private final TokenService tokenService;
    private final ReviewServiceImpl reviewService;

    @GetMapping("/")
    public ResponseEntity<Page<Event>> getAllEvents(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String place,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Event> eventsPage;

        if (name != null && place != null) {
            eventsPage = service.findEventsByNameAndPlace(name, place, pageable);
        } else if (name != null) {
            eventsPage = service.findEventsByName(name, pageable);
        } else if (place != null) {
            eventsPage = service.findEventsByPlace(place, pageable);
        } else {
            eventsPage = service.getAll(pageable);
        }

        eventsPage.forEach(event -> {
            int reviewCount = reviewService.findByEventId(event.getId(), PageRequest.of(0, Integer.MAX_VALUE)).getContent().size();
            event.setReviewCount(reviewCount);
        });

        return new ResponseEntity<>(eventsPage, HttpStatus.OK);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable("id") Long id) {
        return new ResponseEntity<>(service.getOneById(id), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteEvent(@PathVariable Long id, @RequestHeader("Authorization") String tokenHeader) {
        Optional<User> userOptional = tokenService.getUserByToken(tokenHeader.substring(7));

        if (userOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        Event existingEvent = service.getOneById(id);
        if (existingEvent == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        if (!userOptional.get().getRole().name().equals("ROLE_ADMIN")) {
            if (!userOptional.get().getId().equals(existingEvent.getAssociation().getOwner().getId())) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
        }

        service.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @Valid @RequestBody Event event, @RequestHeader("Authorization") String tokenHeader) {
        String jwt = tokenHeader.substring(7);

        Optional<User> userOptional = tokenService.getUserByToken(jwt);
        if (userOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        Event existingEvent = service.getOneById(id);
        if (existingEvent == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        User currentUser = userOptional.get();
        if (!currentUser.getRole().name().equals("ROLE_ADMIN")) {
            if (!currentUser.getId().equals(existingEvent.getAssociation().getOwner().getId())) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
        }

        event.setId(id);
        Event updatedEvent = service.update(event);
        if (updatedEvent != null) {
            return new ResponseEntity<>(updatedEvent, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
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

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @PostMapping("/{id}/join")
    public ResponseEntity<Event> joinEvent(@PathVariable("id") Long id, @RequestBody User user) {
        Event event = service.getOneById(id);
        if (event == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        event.getUsers().add(user);
        Event updatedEvent = service.update(event);

        return new ResponseEntity<>(updatedEvent, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @PostMapping("/{id}/exit")
    public ResponseEntity<?> exitEvent(@PathVariable("id") Long id, @RequestBody User user) {
        Event event = service.getOneById(id);
        if (event == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        event.getUsers().removeIf(u -> u.getId().equals(user.getId()));
        if (event.getUsers().isEmpty()) {
            service.delete(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            Event updatedEvent = service.update(event);
            return new ResponseEntity<>(updatedEvent, HttpStatus.OK);
        }
    }

    @GetMapping("/events/association/{associationId}")
    public ResponseEntity<Page<Event>> getAllEventsByAssociationId(@PathVariable Long associationId, @RequestParam(required = false) String name,
                                                                   @RequestParam(required = false) String place, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "6") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Event> events;
        if (name != null && place != null) {
            events = service.findEventsByAssociationIdAndNameAndPlace(associationId, name, place, pageable);
        } else if (name != null) {
            events = service.findEventsByAssociationIdAndName(associationId, name, pageable);
        } else if (place != null) {
            events = service.findEventsByAssociationIdAndPlace(associationId, place, pageable);
        } else {
            events = service.getAllByAssociationId(associationId, pageable);
        }

        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @PostMapping("/{eventId}/uploadAvatar")
    public ResponseEntity<String> uploadAvatar(
            @PathVariable Long eventId,
            @RequestParam("file") MultipartFile file) {

        try {
            service.uploadAvatar(eventId, file);
            return ResponseEntity.ok("Avatar uploaded successfully");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload avatar: " + e.getMessage());
        }
    }

}