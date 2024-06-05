package edu.com.bachelor.repository;

import edu.com.bachelor.model.Association;
import edu.com.bachelor.model.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {

    Page<Event> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<Event> findAllByAssociationIdOrderByCreatedAtDesc(Long associationId, Pageable pageable);

    Page<Event> findByNameContainingIgnoreCaseAndPlaceContainingIgnoreCase(String name, String place, Pageable pageable);

    Page<Event> findByNameContainingIgnoreCase(String name, Pageable pageable);

    Page<Event> findByPlaceContainingIgnoreCase(String place, Pageable pageable);

    Page<Event> findByAssociationIdAndNameContainingIgnoreCaseAndPlaceContainingIgnoreCase(Long associationId, String name, String place, Pageable pageable);

    Page<Event> findByAssociationIdAndNameContainingIgnoreCase(Long associationId, String name, Pageable pageable);

    Page<Event> findByAssociationIdAndPlaceContainingIgnoreCase(Long associationId, String place, Pageable pageable);


}