package com.example.proyectoweb.services;

import com.example.proyectoweb.dto.ComentarioEventoDTO;
import com.example.proyectoweb.entity.ComentarioEvento;
import com.example.proyectoweb.entity.Evento;
import com.example.proyectoweb.entity.Usuario;
import com.example.proyectoweb.repositories.ComentarioEventoRepository;
import com.example.proyectoweb.repositories.IEventoRepository;
import com.example.proyectoweb.repositories.IUsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComentarioEventoService {
    private final ComentarioEventoRepository comentarioEventoRepository;
    private final IEventoRepository eventoRepository;
    private final IUsuarioRepository usuarioRepository;

    public List<ComentarioEventoDTO> getComentariosByEvento(Long eventoId) {
        return comentarioEventoRepository.findByEventoIdOrderByFechaCreacionDesc(eventoId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ComentarioEventoDTO agregarComentario(Long eventoId, String contenido, Long usuarioId) {
        Evento evento = eventoRepository.findById(eventoId).orElseThrow();
        Usuario usuario = usuarioId != null ? usuarioRepository.findById(usuarioId).orElse(null) : null;
        ComentarioEvento comentario = new ComentarioEvento();
        comentario.setEvento(evento);
        comentario.setContenido(contenido);
        comentario.setUsuario(usuario);
        comentarioEventoRepository.save(comentario);
        return toDTO(comentario);
    }

    private ComentarioEventoDTO toDTO(ComentarioEvento comentario) {
        ComentarioEventoDTO dto = new ComentarioEventoDTO();
        dto.setId(comentario.getId());
        dto.setContenido(comentario.getContenido());
        dto.setFechaCreacion(comentario.getFechaCreacion());
        if (comentario.getUsuario() != null) {
            dto.setUsuarioId(comentario.getUsuario().getId());
            dto.setUsuarioNombre(comentario.getUsuario().getUsername());
        }
        return dto;
    }
}
