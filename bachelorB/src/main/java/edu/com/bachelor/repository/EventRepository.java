package edu.com.bachelor.repository;

import edu.com.bachelor.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {
}