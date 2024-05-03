package edu.com.bachelor.service.review;

import edu.com.bachelor.model.Review;
import java.util.List;

public interface IReviewService {
    Review save(Review review);
    void delete(Long id);
    Review getOneById(Long id);
    List<Review> getAll();
    Review update(Review review);
}
