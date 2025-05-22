package com.example.proyectoweb.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDTO {
    private Long id;
    private String correo;
    private String nombre;
    private String apellido;
    private String username;
    private String rol;
    
    // No incluimos el password por seguridad
}
