package edu.com.bachelor.service.event;

import edu.com.bachelor.model.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IEventService {
    Event save(Event event);
    void delete(Long id);
    Event getOneById(Long id);
    Page<Event> getAll(Pageable pageble);
    Event update(Event event);

    Page<Event> getAllByAssociationId(Long associationId, Pageable pageable);
}
