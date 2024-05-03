package edu.com.bachelor.service.user;

import edu.com.bachelor.model.User;
import java.util.List;

public interface IUserService {
    User save(User user);
    void delete(Long id);
    User getOneById(Long id);
    List<User> getAll();
    User update(User user);
}
