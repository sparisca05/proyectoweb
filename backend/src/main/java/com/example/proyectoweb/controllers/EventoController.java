package com.example.proyectoweb.controllers;

import java.util.List;

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

import com.example.proyectoweb.entity.Evento;
import com.example.proyectoweb.services.EventoService;

@RestController
@RequestMapping("api/v1/eventos")
public class EventoController {

    @Autowired
    private EventoService eventoService;

    // Ver todos los eventos
    @GetMapping
    public ResponseEntity<List<Evento>> getEventos() {
        List<Evento> eventos = eventoService.getAllEventos();
        return ResponseEntity.ok(eventos);
    }

    // Ver un evento por su id
    @GetMapping("/{id}")
    public Evento getEventoById(@PathVariable Long id) {
        return eventoService.getEventoById(id);
    }

    // Comprar un ticket para un evento con el usuario actual
    @PutMapping("/{id}/comprar-ticket")
    public String addInvitado(@PathVariable Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            return eventoService.addInvitado(username, id);
        } catch (RuntimeException e) {
            return e.getMessage();
        }
    }

    // Crear un nuevo evento
    @PostMapping("/nuevo-evento")
    @PreAuthorize("hasRole('ADMIN')")
    public Evento postEvento(@RequestBody Evento evento) {
        return eventoService.saveEvento(evento);
    }

    // Modificar un evento
    @PutMapping("/{id}/modificar-evento")
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

    // Eliminar un invitado de un evento
    @DeleteMapping("/{id}/eliminar-invitado")
    @PreAuthorize("hasAnyAuthority('admin:delete', 'organizador:delete')")
    public String removeInvitado(@RequestParam String username, @PathVariable Long id) {
        try {
            return eventoService.removeInvitado(username, id);
        } catch (RuntimeException e) {
            return e.getMessage();
        }
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
}
