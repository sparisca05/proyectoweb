package com.example.proyectoweb.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {

    String token;
    Long expiresIn; // Tiempo de expiración en milisegundos desde epoch
    Long expiresInSeconds; // Tiempo de expiración en segundos desde ahora

}
