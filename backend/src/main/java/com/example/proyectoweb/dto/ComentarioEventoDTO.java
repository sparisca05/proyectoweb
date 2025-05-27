package com.example.proyectoweb.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ComentarioEventoDTO {
    private Long id;
    private String contenido;
    private LocalDateTime fechaCreacion;
    private Long usuarioId;
    private String usuarioNombre;
}
