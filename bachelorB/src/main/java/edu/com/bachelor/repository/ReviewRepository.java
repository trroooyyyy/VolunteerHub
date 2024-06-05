package edu.com.bachelor.repository;

import edu.com.bachelor.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    boolean existsByEventIdAndUserId(Long eventId, Long userId);

    List<Review> findByUserId(Long userId);

    Page<Review> findByEventIdOrderByRatingDesc(Long eventId, Pageable pageable);

    void deleteByUserId(Long id);
}