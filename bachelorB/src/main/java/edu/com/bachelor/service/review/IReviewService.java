package edu.com.bachelor.service.review;

import edu.com.bachelor.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IReviewService {
    Review save(Review review);
    void delete(Long id);
    Review getOneById(Long id);
    List<Review> getAll();
    Review update(Review review);

    boolean doesReviewExistForEventAndUser(Long eventId, Long userId);

    List<Long> getEventIdsByUserId(Long userId);
    Page<Review> findByEventId(Long eventId, Pageable pageable);
}
