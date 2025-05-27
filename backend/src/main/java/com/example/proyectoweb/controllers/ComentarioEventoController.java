package com.example.proyectoweb.controllers;

import com.example.proyectoweb.dto.ComentarioEventoDTO;
import com.example.proyectoweb.services.ComentarioEventoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/eventos/{eventoId}/comentarios")
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
            @RequestBody ComentarioRequest request,
            Authentication authentication
    ) {
        Long usuarioId = null;
        if (authentication != null && authentication.getPrincipal() instanceof org.springframework.security.core.userdetails.User user) {
            // Aquí deberías mapear el username a tu entidad Usuario
            // Por simplicidad, se asume que el username es el ID (ajusta según tu modelo)
            try {
                usuarioId = Long.parseLong(user.getUsername());
            } catch (NumberFormatException ignored) {}
        }
        ComentarioEventoDTO dto = comentarioEventoService.agregarComentario(eventoId, request.getContenido(), usuarioId);
        return ResponseEntity.ok(dto);
    }

    public static class ComentarioRequest {
        private String contenido;
        public String getContenido() { return contenido; }
        public void setContenido(String contenido) { this.contenido = contenido; }
    }
}
