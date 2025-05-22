package com.example.proyectoweb.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvitadoExternoDTO {
    private Long id;
    private String nombre;
    private String apellido;
    private String descripcionRol;
}
