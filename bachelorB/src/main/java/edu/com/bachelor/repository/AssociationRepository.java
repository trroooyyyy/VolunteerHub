package edu.com.bachelor.repository;

import edu.com.bachelor.model.Association;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssociationRepository extends JpaRepository<Association, Long> {
}