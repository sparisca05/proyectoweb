package com.example.proyectoweb.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.proyectoweb.dto.EventoDTO;
import com.example.proyectoweb.dto.HitoDTO;
import com.example.proyectoweb.entity.Evento;
import com.example.proyectoweb.entity.Hito;
import com.example.proyectoweb.services.EventoService;
import com.example.proyectoweb.services.InvitadoExternoService;
import com.example.proyectoweb.services.OrganizacionExternaService;
import com.example.proyectoweb.services.UsuarioService;

@RestController
@RequestMapping("api/v1/eventos")
public class EventoController {

    @Autowired
    private EventoService eventoService;
    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private InvitadoExternoService invitadoService;
    @Autowired
    private OrganizacionExternaService organizacionService;

    // Ver todos los eventos
    @GetMapping
    public ResponseEntity<List<EventoDTO>> getEventos() {
        try {
            List<Evento> eventos = eventoService.getAllEventos();
            if (eventos.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            // Convertir a DTOs
            List<EventoDTO> eventosDto = eventos.stream()
                .map(evento -> EventoControllerHelper.entityToDtoWithRelations(evento, usuarioService, invitadoService, organizacionService))
                .collect(Collectors.toList());
            return ResponseEntity.ok(eventosDto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Ver eventos activos
    @GetMapping("/activos")
    public ResponseEntity<List<EventoDTO>> getEventosActivos() {
        try {
            List<Evento> eventos = eventoService.getEventosActivos();
            if (eventos.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            // Convertir a DTOs
            List<EventoDTO> eventosDto = eventos.stream()
                .map(evento -> EventoControllerHelper.entityToDtoWithRelations(evento, usuarioService, invitadoService, organizacionService))
                .collect(Collectors.toList());
            return ResponseEntity.ok(eventosDto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Ver un evento por su id
    @GetMapping("/{id}")
    public EventoDTO getEventoById(@PathVariable Long id) {
        Evento evento = eventoService.getEventoById(id);
        if (evento == null) {
            return null;
        }
        // Convertir a DTO
        return EventoControllerHelper.entityToDtoWithRelations(evento, usuarioService, invitadoService, organizacionService);
    }
    
    // Crear un nuevo evento
    @PostMapping("/nuevo-evento")
    @PreAuthorize("hasRole('ADMIN')")
    public Evento postEvento(@RequestBody Evento evento) {
        return eventoService.saveEvento(evento);
    }

    // Participar en un evento con el usuario actual
    @PutMapping("/{id}/agregar-participante")
    public ResponseEntity<String> addParticipante(@PathVariable Long id, @RequestBody String claveIngresada) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            String response = eventoService.addParticipante(username, id, claveIngresada);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Inscribir un invitado externo a un evento
    @PutMapping("/{id}/agregar-invitado")
    @PreAuthorize("hasAnyAuthority('admin:update', 'organizador:update')")
    public ResponseEntity<String> addInvitado(@RequestBody String nombre, @PathVariable Long id) {
        try {
            String response = eventoService.addInvitado(nombre, id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Modificar un evento
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('admin:update', 'organizador:update')")
    public Evento updateEvento(@RequestBody Evento evento, @PathVariable Long id) {
        return eventoService.updateEventoById(evento, id);
    }

    // Eliminar un evento
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('admin:delete', 'organizador:delete')")
    public String deleteEvento(@PathVariable Long id) {
        return eventoService.deleteEvento(id);
    }

    // Eliminar un participante de un evento
    @DeleteMapping("/{id}/eliminar-participante")
    @PreAuthorize("hasAnyAuthority('admin:delete', 'organizador:delete')")
    public String removeParticipante(@RequestParam String username, @PathVariable Long id) {
        try {
            return eventoService.removeParticipante(username, id);
        } catch (RuntimeException e) {
            return e.getMessage();
        }
    }
    
    // Eliminar un invitado de un evento
    @DeleteMapping("/{id}/eliminar-invitado")
    @PreAuthorize("hasAnyAuthority('admin:delete', 'organizador:delete')")
    public ResponseEntity<String> removeInvitado(@RequestParam Long invitadoId, @PathVariable Long id) {
        try {
            String response = eventoService.removeInvitado(invitadoId, id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
