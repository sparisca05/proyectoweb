package com.example.proyectoweb.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventoDTO {
    private Long id;
    private String nombre;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy HH:mm")
    private LocalDateTime fecha;
    
    private String tipo;
    private String nombreOrganizador;
    private String contactoOrganizador;
    private boolean isPublico = true;
    private String clave;
    
    // Referencias simplificadas
    private List<HitoResumenDTO> hitos = new ArrayList<>();
    private EmpresaResumenDTO empresaPatrocinadora;
    private List<UsuarioResumenDTO> participantes = new ArrayList<>();
    private List<InvitadoExternoResumenDTO> invitados = new ArrayList<>();
    private List<OrganizacionExternaResumenDTO> organizaciones = new ArrayList<>();
    
    // DTOs internos para referencias resumidas
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HitoResumenDTO {
        private Long id;
        private String nombre;
        private String categoria;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EmpresaResumenDTO {
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

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InvitadoExternoResumenDTO {
        private Long id;
        private String nombre;
        private String apellido;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrganizacionExternaResumenDTO {
        private Long id;
        private String nombre;
    }
}
