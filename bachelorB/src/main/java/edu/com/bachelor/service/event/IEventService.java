package edu.com.bachelor.service.event;

import edu.com.bachelor.model.Event;
import java.util.List;

public interface IEventService {
    Event save(Event event);
    void delete(Long id);
    Event getOneById(Long id);
    List<Event> getAll();
    Event update(Event event);
}
