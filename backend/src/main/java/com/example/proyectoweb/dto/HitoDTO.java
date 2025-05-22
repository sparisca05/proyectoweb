package com.example.proyectoweb.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HitoDTO {
    private Long id;
    private String nombre;
    private String categoria;
    
    // Para el evento, solo incluimos información básica
    private EventoResumenDTO eventoRelevante;
    
    // Para los ganadores, solo incluimos información básica
    private List<UsuarioResumenDTO> ganadores = new ArrayList<>();
    
    // DTOs internos para referencias resumidas
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EventoResumenDTO {
        private Long id;
        private String nombre;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UsuarioResumenDTO {
        private Long id;
        private String username;
        private String nombre;
        private String apellido;
    }
}
