package edu.com.bachelor.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "review")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    private String content;
    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;
    @Min(0)
    @Max(10)
    private int rating;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


}
