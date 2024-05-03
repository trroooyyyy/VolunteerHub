package edu.com.bachelor.repository;

import edu.com.bachelor.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}