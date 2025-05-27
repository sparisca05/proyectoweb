package com.example.proyectoweb.repositories;

import com.example.proyectoweb.entity.ComentarioEvento;
import com.example.proyectoweb.entity.Evento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComentarioEventoRepository extends JpaRepository<ComentarioEvento, Long> {
    List<ComentarioEvento> findByEventoIdOrderByFechaCreacionDesc(Long eventoId);
}
