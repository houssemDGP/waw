package com.waw.waw.dto;

import lombok.Data;

@Data
public class BusinessResponseDTO {
    private Long id;
    private String username;
    private String email;
    private String phone;
    private String role;
    private String type;
    private String rs;
    private String rne;
    private String nom;
    private String adresse;
    private String ville;
    private String pays;
    private String latitude;
    private String longitude;
    private boolean active;
    private String creationDate;  // optionnel, en String formaté
}
