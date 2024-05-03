package edu.com.bachelor.auth;

import edu.com.bachelor.model.Role;
import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
public class RegistrationRequest {
    private String login;
    private String password;
    private String email;
    private String firstName;
    private String lastName;
    private String country;
    private int age;
    private String telephone;
}
