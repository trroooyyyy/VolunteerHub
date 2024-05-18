package edu.com.bachelor.service.association;

import edu.com.bachelor.model.Association;
import edu.com.bachelor.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IAssociationService {
    Association save(Association association);
    void delete(Long id);
    Association getOneById(Long id);
    Page<Association> getAll(Pageable pageable);
    Association update(Association association);
}
