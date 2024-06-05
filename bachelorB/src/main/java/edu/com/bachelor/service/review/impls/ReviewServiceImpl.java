package edu.com.bachelor.service.review.impls;

import edu.com.bachelor.model.Review;
import edu.com.bachelor.repository.ReviewRepository;
import edu.com.bachelor.service.review.IReviewService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ReviewServiceImpl implements IReviewService {
    private ReviewRepository repository;

    @Override
    public Review save(Review review) {
        if(review.getId() != null){
            return null;
        }
        review.setCreatedAt(LocalDateTime.now());
        return repository.save(review);
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Override
    public Review getOneById(Long id) {
        return repository.findById(id).orElseThrow(NoSuchElementException::new);
    }

    @Override
    public List<Review> getAll() {
        return repository.findAll();
    }

    @Override
    public Review update(Review review) {
        Review existingReview = repository.findById(review.getId()).orElseThrow(NoSuchElementException::new);
        existingReview.setUser(review.getUser());
        existingReview.setContent(review.getContent());
        existingReview.setEvent(review.getEvent());
        existingReview.setRating(review.getRating());
        existingReview.setUpdatedAt(LocalDateTime.now());
        return repository.save(existingReview);
    }

    @Override
    public boolean doesReviewExistForEventAndUser(Long eventId, Long userId) {
        return repository.existsByEventIdAndUserId(eventId, userId);
    }

    @Override
    public List<Long> getEventIdsByUserId(Long userId) {
        List<Review> reviews = repository.findByUserId(userId);
        return reviews.stream()
                .map(review -> review.getEvent().getId())
                .collect(Collectors.toList());
    }

    @Override
    public Page<Review> findByEventId(Long eventId, Pageable pageable) {
        return repository.findByEventIdOrderByRatingDesc(eventId, pageable);
    }

    @Transactional
    public void deleteAllReviewsByUser(Long id) {
        repository.deleteByUserId(id);
    }
}

