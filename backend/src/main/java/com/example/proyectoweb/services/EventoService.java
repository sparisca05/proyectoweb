package com.example.proyectoweb.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.proyectoweb.entity.Evento;
import com.example.proyectoweb.entity.InvitadoExterno;
import com.example.proyectoweb.entity.Usuario;
import com.example.proyectoweb.repositories.IEventoRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EventoService {

    @Autowired
    private final IEventoRepository eventoRepository;
    private final UsuarioService usuarioService;
    private final InvitadoExternoService invitadoService;

    public Evento saveEvento(Evento evento) {
        return eventoRepository.save(evento);
    }

    public Evento getEventoById(Long eventoId) {
        return eventoRepository.findById(eventoId)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado"));
    }

    public List<Evento> getAllEventos() {
        return eventoRepository.findAll();
    }

    public List<Evento> getEventosActivos() {
        return eventoRepository.findEventosAnteriores();
    }

    public Evento updateEventoById(Evento request, Long eventoId) {
        Evento evento = eventoRepository.findById(eventoId).get();

        evento.setNombre(request.getNombre());
        evento.setFecha(request.getFecha());
        evento.setTipo(request.getTipo());
        evento.setNombreOrganizador(request.getNombreOrganizador());
        evento.setContactoOrganizador(request.getContactoOrganizador());
        saveEvento(evento);

        return evento;
    }

    public String deleteEvento(Long eventoId) {
        try {
            eventoRepository.deleteById(eventoId);
            return "Evento eliminado";
        } catch (Exception e) {
            return "Error al eliminar evento";
        }
    }

    @Transactional
    public String addParticipante(String username, Long eventoId, String claveIngresada) throws RuntimeException {
        Evento evento = getEventoById(eventoId);
        if (!evento.getClave().equals(claveIngresada)) {
            throw new RuntimeException("La clave ingresada es incorrecta, intente de nuevo.");
        }
        Usuario usuario = usuarioService.getUserByUsername(username);
        if (!evento.getParticipantes().contains(usuario)) {
            evento.addParticipante(usuario);
            eventoRepository.save(evento);
            return "Fuiste agregado con éxito al evento: " + evento.getNombre();
        } else {
            throw new RuntimeException("Usuario ya agregado al evento");
        }
    }

    public String removeParticipante(String username, Long eventoId) throws RuntimeException {
        Evento evento = getEventoById(eventoId);
        Usuario usuario = usuarioService.getUserByUsername(username);
        if (evento.getParticipantes().contains(usuario)) {
            evento.removeParticipante(usuario);
            eventoRepository.save(evento);
            return username + " se eliminó con éxito del evento: " + evento.getNombre();
        } else {
            throw new RuntimeException("Usuario no encontrado en el evento");
        }
    }

    @Transactional
    public String addInvitado(String nombre, Long eventoId) throws RuntimeException {
        Evento evento = getEventoById(eventoId);
        InvitadoExterno invitadoExterno = invitadoService.getInvitadoExternoByNombre(nombre);
        if (evento != null) {
            evento.addInvitado(invitadoExterno);
            eventoRepository.save(evento);
        } else {
            throw new RuntimeException("Error al inscribir invitados.");
        }
        return "El invitado fue inscrito con éxito al evento.";
    }

    public String removeInvitado(Long invitadoId, Long eventoId) throws RuntimeException {
        Evento evento = getEventoById(eventoId);
        InvitadoExterno invitadoExterno = invitadoService.getInvitadoExternoById(invitadoId);
        if (evento.getInvitados().contains(invitadoExterno)) {
            evento.removeInvitado(invitadoExterno);
            eventoRepository.save(evento);
            return "El invitado se eliminó con éxito del evento." ;
        } else {
            throw new RuntimeException("Error al eliminar invitado del evento");
        }
    }
}
