package edu.com.bachelor.repository;

import edu.com.bachelor.model.Association;
import edu.com.bachelor.model.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {

    Page<Event> findAllByOrderByCreatedAtDesc(Pageable pageable);
}