package edu.com.bachelor.service.user;

import edu.com.bachelor.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IUserService {
    User save(User user);
    void delete(Long id);
    User getOneById(Long id);
    Page<User> getAll(Pageable pageable);
    User update(User user);
}
