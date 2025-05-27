package com.example.proyectoweb.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmpresaDTO {
    private Long id;    private String nombre;
    private String descripcion;
    private String logoUrl;
    
    // Referencia simplificada a los eventos
    private List<EventoResumenDTO> eventos;
    
    // DTO interno para referencia resumida
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EventoResumenDTO {
        private Long id;
        private String nombre;
    }
}
