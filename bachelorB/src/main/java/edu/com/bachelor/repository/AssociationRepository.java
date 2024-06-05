package edu.com.bachelor.repository;

import edu.com.bachelor.model.Association;
import edu.com.bachelor.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AssociationRepository extends JpaRepository<Association, Long> {

    @Query("SELECT au FROM Association a JOIN a.users au WHERE a.id = ?1")
    List<User> findUsersByAssociationId(Long associationId);

    @Query("SELECT au FROM Association a JOIN a.users au WHERE a.id = ?1")
    Page<User> findUsersByAssociationIdPageble(Long associationId, Pageable pageable);

    List<Association> findByOwnerId(Long ownerId);

    Page<Association> findAllByOrderByCreatedAt(Pageable pageable);

    @Query("SELECT au FROM Association a JOIN a.users au WHERE a.id = :associationId AND " +
            "(LOWER(au.login) LIKE %:login% OR :login IS NULL OR :login = '') AND " +
            "(LOWER(au.email) LIKE %:email% OR :email IS NULL OR :email = '') AND " +
            "(LOWER(au.telephone) LIKE %:telephone% OR :telephone IS NULL OR :telephone = '')")
    Page<User> findUsersByAssociationIdAndSearchParams(Long associationId, String login, String email, String telephone, Pageable pageable);
    


    Page<Association> findByNameContainingIgnoreCase(String name, Pageable pageable);

    Page<Association> findByPlaceContainingIgnoreCase(String place, Pageable pageable);

    Page<Association> findByNameContainingIgnoreCaseAndPlaceContainingIgnoreCase(String name, String place, Pageable pageable);

    void deleteByOwnerId(Long id);
}