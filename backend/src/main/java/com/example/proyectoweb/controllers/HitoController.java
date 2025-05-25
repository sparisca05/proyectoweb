package com.example.proyectoweb.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.proyectoweb.dto.HitoDTO;
import com.example.proyectoweb.entity.Evento;
import com.example.proyectoweb.entity.Hito;
import com.example.proyectoweb.services.EventoService;
import com.example.proyectoweb.services.HitoService;
import com.example.proyectoweb.services.UsuarioService;

@RestController
@RequestMapping("api/v1/hitos")
public class HitoController {

    @Autowired
    private HitoService hitoService;
    
    @Autowired
    private EventoService eventoService;

    @Autowired
    private UsuarioService usuarioService;

    // Ver todos los hitos
    @GetMapping
    public ResponseEntity<List<HitoDTO>> getAllHitos() {
        try {
            List<Hito> hitos = hitoService.getAllHitos();
            if (hitos.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            // Convertir a DTOs
            List<HitoDTO> hitosDto = hitos.stream()
                .map(hito -> HitoControllerHelper.entityToDto(hito, usuarioService))
                .collect(Collectors.toList());
            return ResponseEntity.ok(hitosDto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Ver un hito por su ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getHitoById(@PathVariable Long id) {
        try {
            Hito hito = hitoService.getHitoById(id);
            if (hito == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(hito);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Error al obtener el hito: " + e.getMessage());
        }
    }

    // Inscribir un nuevo hito
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> postHito(@RequestBody Hito hito) {
        try {
            // Si hay un evento especificado por ID, configurarlo
            if (hito.getEventoRelevante() != null && hito.getEventoRelevante().getId() != null) {
                Long eventoId = hito.getEventoRelevante().getId();
                Evento evento = eventoService.getEventoById(eventoId);
                hito.setEventoRelevante(evento);
            }
            
            Hito createdHito = hitoService.saveHito(hito);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdHito);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Error al crear el hito: " + e.getMessage());
        }
    }

    // Actualizar un hito existente
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateHito(@PathVariable Long id, @RequestBody Hito hitoRequest) {
        try {
            // Verificar si el hito existe
            Hito existingHito = hitoService.getHitoById(id);
            if (existingHito == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Actualizar campos básicos
            existingHito.setNombre(hitoRequest.getNombre());
            existingHito.setCategoria(hitoRequest.getCategoria());
            
            // Si hay un evento especificado por ID, configurarlo
            if (hitoRequest.getEventoRelevante() != null && hitoRequest.getEventoRelevante().getId() != null) {
                Long eventoId = hitoRequest.getEventoRelevante().getId();
                Evento evento = eventoService.getEventoById(eventoId);
                existingHito.setEventoRelevante(evento);
            }
            
            // Guardar los cambios
            Hito updatedHito = hitoService.updateHito(id, existingHito);
            return ResponseEntity.ok(updatedHito);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Error al actualizar el hito: " + e.getMessage());
        }
    }

    // Eliminar un hito
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHito(@PathVariable Long id) {
        try {
            // Verificar si el hito existe
            Hito existingHito = hitoService.getHitoById(id);
            if (existingHito == null) {
                return ResponseEntity.notFound().build();
            }
            
            hitoService.deleteHito(id);
            return ResponseEntity.ok("Hito eliminado con éxito");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Error al eliminar el hito: " + e.getMessage());
        }
    }
}
