package edu.com.bachelor.service.event.impls;

import edu.com.bachelor.model.Event;
import edu.com.bachelor.repository.EventRepository;
import edu.com.bachelor.service.event.IEventService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
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
    public List<Event> getAll() {
        return repository.findAll();
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
}
