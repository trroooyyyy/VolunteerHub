package edu.com.bachelor.repository;

import edu.com.bachelor.model.Association;
import edu.com.bachelor.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AssociationRepository extends JpaRepository<Association, Long> {

    @Query("SELECT au FROM Association a JOIN a.users au WHERE a.id = ?1")
    List<User> findUsersByAssociationId(Long associationId);

}