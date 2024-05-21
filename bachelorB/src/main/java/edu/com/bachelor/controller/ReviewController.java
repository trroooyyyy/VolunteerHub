package edu.com.bachelor.controller;

import edu.com.bachelor.model.Event;
import edu.com.bachelor.model.Review;
import edu.com.bachelor.service.review.impls.ReviewServiceImpl;
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
@RequestMapping("/api/review")
@AllArgsConstructor
public class ReviewController {
    private final ReviewServiceImpl service;

    @GetMapping("/")
    public ResponseEntity<List<Review>> getAllReviews() {
        return new ResponseEntity<>(service.getAll(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Review> getReviewById(@PathVariable("id") Long id) {
        return new ResponseEntity<>(service.getOneById(id), HttpStatus.OK);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteReview(@PathVariable("id") Long id) {
        service.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/")
    public ResponseEntity<Review> updateReview(@Valid @RequestBody Review review) {
        return new ResponseEntity<>(service.update(review), HttpStatus.OK);
    }
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @PostMapping("/")
    public ResponseEntity<Review> saveReview(@RequestBody Review review)  {
        Review savedReview = service.save(review);
        if(savedReview==null){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(savedReview, HttpStatus.OK);
    }

    @GetMapping("/exists/{eventId}/{userId}")
    public ResponseEntity<Boolean> reviewExistsByEventIdAndUserId(@PathVariable("eventId") Long eventId, @PathVariable("userId") Long userId) {
        boolean exists = service.doesReviewExistForEventAndUser(eventId, userId);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/events/{userId}")
    public ResponseEntity<List<Long>> getEventIdsByUserId(@PathVariable("userId") Long userId) {
        List<Long> eventIds = service.getEventIdsByUserId(userId);
        return new ResponseEntity<>(eventIds, HttpStatus.OK);
    }

    @GetMapping("/{eventId}/reviews")
    public ResponseEntity<Page<Review>> getReviewsByEventId(@PathVariable("eventId") Long eventId, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Review> reviews = service.findByEventId(eventId, pageable);
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }
}