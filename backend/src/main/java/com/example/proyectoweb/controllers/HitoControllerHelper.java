package com.example.proyectoweb.controllers;

import java.util.ArrayList;
import java.util.List;

import com.example.proyectoweb.dto.HitoDTO;
import com.example.proyectoweb.dto.HitoDTO.EventoResumenDTO;
import com.example.proyectoweb.entity.Evento;
import com.example.proyectoweb.entity.Hito;
import com.example.proyectoweb.entity.Usuario;
import com.example.proyectoweb.services.UsuarioService;

/**
 * Clase auxiliar para manejar la conversión entre entidades y DTOs en el controlador de hitos
 */
public class HitoControllerHelper {
    
    /**
     * Convierte una entidad Hito a un DTO para devolverlo en las respuestas del controlador
     */
    public static HitoDTO entityToDto(Hito hito, UsuarioService usuarioService) {
        if (hito == null) {
            return null;
        }
        
        HitoDTO dto = new HitoDTO();
        
        // Establecer valores directamente con los métodos de acceso
        try {
            dto.setId(hito.getId());
            dto.setNombre(hito.getNombre());
            dto.setCategoria(hito.getCategoria());
            
            // Convertir evento relacionado
            if (hito.getEventoRelevante() != null) {
                dto.setEventoRelevante(new EventoResumenDTO (
                    hito.getEventoRelevante().getId(),
                    hito.getEventoRelevante().getNombre()
                ));
                
                HitoDTO.EventoResumenDTO eventoDto = new HitoDTO.EventoResumenDTO(
                    hito.getEventoRelevante().getId(),
                    hito.getEventoRelevante().getNombre()
                );
                dto.setEventoRelevante(eventoDto);
            }
            
            // Convertir ganadores
            List<HitoDTO.UsuarioResumenDTO> ganadoresDto = new ArrayList<>();
            if (hito.getGanadores() != null) {
                for (String usuario : hito.getGanadores()) {
                    Usuario usuarioEntity = usuarioService.getUserByUsername(usuario);
                    HitoDTO.UsuarioResumenDTO usuarioDto = new HitoDTO.UsuarioResumenDTO(
                        usuarioEntity.getId(), 
                        usuarioEntity.getUsername(),
                        usuarioEntity.getNombre(),
                        usuarioEntity.getApellido()
                    );
                    ganadoresDto.add(usuarioDto);
                }
            }
            dto.setGanadores(ganadoresDto);
        } catch (Exception e) {
            // Log error o manejar excepción
            e.printStackTrace();
        }
        
        return dto;
    }
    
    /**
     * Convierte una lista de entidades a una lista de DTOs
     */
    public static List<HitoDTO> entityListToDtoList(List<Hito> hitos, UsuarioService usuarioService) {
        if (hitos == null) {
            return new ArrayList<>();
        }
        
        List<HitoDTO> dtoList = new ArrayList<>();
        for (Hito hito : hitos) {
            dtoList.add(entityToDto(hito, usuarioService));
        }
        
        return dtoList;
    }
    
    /**
     * Actualiza una entidad Hito con los datos de un DTO
     * No actualiza las relaciones, eso debe hacerse manualmente en el controlador
     */
    public static Hito updateEntityFromDto(Hito hito, HitoDTO dto) {
        if (hito != null && dto != null) {
            try {
                if (dto.getNombre() != null) {
                    hito.setNombre(dto.getNombre());
                }
                
                if (dto.getCategoria() != null) {
                    hito.setCategoria(dto.getCategoria());
                }
                
                // Las relaciones se manejan en el controlador
            } catch (Exception e) {
                // Log error o manejar excepción
                e.printStackTrace();
            }
        }
        
        return hito;
    }
}
