package com.example.proyectoweb.controllers;

import com.example.proyectoweb.dto.ComentarioEventoDTO;
import com.example.proyectoweb.services.ComentarioEventoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/comentarios/{eventoId}")
@RequiredArgsConstructor
public class ComentarioEventoController {
    private final ComentarioEventoService comentarioEventoService;

    @GetMapping
    public List<ComentarioEventoDTO> getComentarios(@PathVariable Long eventoId) {
        return comentarioEventoService.getComentariosByEvento(eventoId);
    }

    @PostMapping
    public ResponseEntity<ComentarioEventoDTO> agregarComentario(
            @PathVariable Long eventoId,
            @RequestBody ComentarioRequest request
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username;
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build(); // Unauthorized
        } else {
            username = authentication.getName();
        }
        ComentarioEventoDTO dto = comentarioEventoService.agregarComentario(eventoId, request.getContenido(), username);
        return ResponseEntity.ok(dto);
    }

    public static class ComentarioRequest {
        private String contenido;
        public String getContenido() { return contenido; }
        public void setContenido(String contenido) { this.contenido = contenido; }
    }
}
