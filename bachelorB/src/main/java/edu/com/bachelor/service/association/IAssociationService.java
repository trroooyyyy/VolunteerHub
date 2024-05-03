package edu.com.bachelor.service.association;

import edu.com.bachelor.model.Association;
import java.util.List;

public interface IAssociationService {
    Association save(Association association);
    void delete(Long id);
    Association getOneById(Long id);
    List<Association> getAll();
    Association update(Association association);
}
