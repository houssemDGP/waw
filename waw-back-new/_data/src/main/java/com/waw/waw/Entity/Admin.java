package com.waw.waw.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.time.LocalDateTime;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Admin {

 @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;

    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;

    @Enumerated(EnumType.STRING)
    private EditorView events;
    
    @Enumerated(EnumType.STRING)
    private EditorView users;
    
    @Enumerated(EnumType.STRING)
    private EditorView categories;
    
    
    @Enumerated(EnumType.STRING)
    private EditorView reservations;
    
    @Enumerated(EnumType.STRING)
    private EditorView activites;
    
    @Enumerated(EnumType.STRING)
    private EditorView admins;

    @Enumerated(EnumType.STRING)
    private EditorView banners;

    @Enumerated(EnumType.STRING)
    private EditorView logs;

    @Enumerated(EnumType.STRING)
    private EditorView bussiness;

    @Enumerated(EnumType.STRING)
    private EditorView villes;

    @Enumerated(EnumType.STRING)
    private EditorView articleIndex;

    private String resetCode;

    private LocalDateTime resetCodeExpiry;



public enum Status {
    ACTIVE, BLOCKED
}
public enum EditorView {
 YES, NONE
}
}