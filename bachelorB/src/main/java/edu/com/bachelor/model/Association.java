package edu.com.bachelor.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;


@Entity
@Table(name = "association")
@Getter
@Setter
@NoArgsConstructor
public class Association {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private String place;
    @ManyToMany
    @JoinTable(
            name = "association_user",
            joinColumns = @JoinColumn(name = "association_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    private List<User> users;
    @OneToMany
    @JoinColumn(name = "association_id")
    private List<Event> events;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
