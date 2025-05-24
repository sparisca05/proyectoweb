package com.example.proyectoweb.controllers;

import com.example.proyectoweb.dto.EventoDTO;
import com.example.proyectoweb.entity.Evento;

public class EventoControllerHelper {
    // Método para convertir una entidad Evento a un DTO EventoDTO
    public static EventoDTO entityToDto(Evento evento) {
        if (evento == null) {
            return null;
        }
        // Crear y devolver un nuevo EventoDTO utilizando el builder
        EventoDTO dto = new EventoDTO();

        return EventoDTO.builder()
                .id(evento.getId())
                .nombre(evento.getNombre())
                .fecha(evento.getFecha())
                .tipo(evento.getTipo())
                .nombreOrganizador(evento.getNombreOrganizador())
                .contactoOrganizador(evento.getContactoOrganizador())
                .clave(evento.getClave())
                .build();
    }
    
}
