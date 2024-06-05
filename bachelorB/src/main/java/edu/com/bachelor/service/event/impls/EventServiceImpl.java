package edu.com.bachelor.service.event.impls;

import edu.com.bachelor.model.Association;
import edu.com.bachelor.model.Event;
import edu.com.bachelor.model.User;
import edu.com.bachelor.repository.EventRepository;
import edu.com.bachelor.service.event.IEventService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@AllArgsConstructor
public class EventServiceImpl implements IEventService {
    private EventRepository repository;

    @Override
    public Event save(Event event) {
        if(event.getId() != null){
            return null;
        }
        event.setCreatedAt(LocalDateTime.now());
        return repository.save(event);
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Override
    public Event getOneById(Long id) {
        return repository.findById(id).orElseThrow(NoSuchElementException::new);
    }
    @Override
    public Page<Event> getAll(Pageable pageable) {
        return repository.findAllByOrderByCreatedAtDesc(pageable);
    }

    @Override
    public Event update(Event event) {
        Event existingEvent = repository.findById(event.getId()).orElseThrow(NoSuchElementException::new);
        existingEvent.setName(event.getName());
        existingEvent.setDescription(event.getDescription());
        existingEvent.setPlace(event.getPlace());
        existingEvent.setDateStart(event.getDateStart());
        existingEvent.setDateEnd(event.getDateEnd());
        existingEvent.setUpdatedAt(LocalDateTime.now());
        return repository.save(existingEvent);
    }

    @Override
    public Page<Event> getAllByAssociationId(Long associationId, Pageable pageable) {
        return repository.findAllByAssociationIdOrderByCreatedAtDesc(associationId, pageable);
    }


    public Page<Event> findEventsByNameAndPlace(String name, String place, Pageable pageable) {
        return repository.findByNameContainingIgnoreCaseAndPlaceContainingIgnoreCase(name, place, pageable);
    }

    public Page<Event> findEventsByName(String name, Pageable pageable) {
        return repository.findByNameContainingIgnoreCase(name, pageable);
    }

    public Page<Event> findEventsByPlace(String place, Pageable pageable) {
        return repository.findByPlaceContainingIgnoreCase(place, pageable);
    }


    public Page<Event> findEventsByAssociationIdAndNameAndPlace(Long associationId, String name, String place, Pageable pageable) {
        return repository.findByAssociationIdAndNameContainingIgnoreCaseAndPlaceContainingIgnoreCase(associationId, name, place, pageable);
    }


    public Page<Event> findEventsByAssociationIdAndName(Long associationId, String name, Pageable pageable) {
        return repository.findByAssociationIdAndNameContainingIgnoreCase(associationId, name, pageable);
    }


    public Page<Event> findEventsByAssociationIdAndPlace(Long associationId, String place, Pageable pageable) {
        return repository.findByAssociationIdAndPlaceContainingIgnoreCase(associationId, place, pageable);
    }

}
