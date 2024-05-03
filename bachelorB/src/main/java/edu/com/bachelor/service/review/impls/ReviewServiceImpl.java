package edu.com.bachelor.service.review.impls;

import edu.com.bachelor.model.Review;
import edu.com.bachelor.repository.ReviewRepository;
import edu.com.bachelor.service.review.IReviewService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

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
}

