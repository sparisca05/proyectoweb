package com.example.proyectoweb.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.example.proyectoweb.dto.EventoDTO;
import com.example.proyectoweb.entity.Empresa;
import com.example.proyectoweb.entity.Evento;
import com.example.proyectoweb.entity.Hito;
import com.example.proyectoweb.entity.InvitadoExterno;
import com.example.proyectoweb.entity.OrganizacionExterna;
import com.example.proyectoweb.entity.Usuario;
import com.example.proyectoweb.services.EmpresaService;
import com.example.proyectoweb.services.InvitadoExternoService;
import com.example.proyectoweb.services.OrganizacionExternaService;
import com.example.proyectoweb.services.UsuarioService;

/**
 * Clase auxiliar para manejar la conversión entre entidades y DTOs en el controlador de eventos
 */
public class EventoControllerHelper {
    
    /**
     * Convierte una entidad Evento a un DTO básico sin relaciones complejas
     */
    public static EventoDTO entityToDto(Evento evento) {
        if (evento == null) {
            return null;
        }
          // Crear y devolver un nuevo EventoDTO utilizando el builder
        return EventoDTO.builder()
                .id(evento.getId())
                .nombre(evento.getNombre())
                .fecha(evento.getFecha())
                .tipo(evento.getTipo())
                .nombreOrganizador(evento.getNombreOrganizador())
                .contactoOrganizador(evento.getContactoOrganizador())
                .isPublico(evento.isPublico())
                .clave(evento.getClave())
                .imagenUrl(evento.getImagenUrl())
                .build();
    }
    
    /**
     * Convierte una entidad Evento a un DTO completo con relaciones
     */
    public static EventoDTO entityToDtoWithRelations(Evento evento, 
                                                    UsuarioService usuarioService, 
                                                    InvitadoExternoService invitadoService, 
                                                    OrganizacionExternaService organizacionService) {
        if (evento == null) {
            return null;
        }
        
        EventoDTO dto = entityToDto(evento);
        
        try {
            // Convertir hitos
            if (evento.getHitos() != null && !evento.getHitos().isEmpty()) {
                List<EventoDTO.HitoResumenDTO> hitosDto = evento.getHitos().stream()
                    .map(hito -> new EventoDTO.HitoResumenDTO(
                        hito.getId(),
                        hito.getNombre(),
                        hito.getCategoria()
                    ))
                    .collect(Collectors.toList());
                
                dto.setHitos(hitosDto);
            }
            
            // Convertir empresa patrocinadora
            if (evento.getEmpresaPatrocinadora() != null) {
                EventoDTO.EmpresaResumenDTO empresaDto = new EventoDTO.EmpresaResumenDTO(
                    evento.getEmpresaPatrocinadora().getId(),
                    evento.getEmpresaPatrocinadora().getNombre()
                );
                
                dto.setEmpresaPatrocinadora(empresaDto);
            }
            
            // Convertir participantes (usuarios)
            if (evento.getParticipantes() != null) {
                List<EventoDTO.UsuarioResumenDTO> participantesDto = new ArrayList<>();
                
                for (Usuario usuario : evento.getParticipantes()) {
                    EventoDTO.UsuarioResumenDTO usuarioDto = new EventoDTO.UsuarioResumenDTO(
                        usuario.getId(),
                        usuario.getUsername(),
                        usuario.getNombre(),
                        usuario.getApellido()
                    );
                    participantesDto.add(usuarioDto);
                }
                
                dto.setParticipantes(participantesDto);
            }
            
            // Convertir invitados externos
            if (evento.getInvitados() != null) {
                List<EventoDTO.InvitadoExternoResumenDTO> invitadosDto = new ArrayList<>();
                
                for (InvitadoExterno invitado : evento.getInvitados()) {
                    EventoDTO.InvitadoExternoResumenDTO invitadoDto = new EventoDTO.InvitadoExternoResumenDTO(
                        invitado.getId(),
                        invitado.getNombre(),
                        invitado.getApellido()
                    );
                    invitadosDto.add(invitadoDto);
                }
                
                dto.setInvitados(invitadosDto);
            }
            
            // Convertir organizaciones externas
            if (evento.getOrganizaciones() != null) {
                List<EventoDTO.OrganizacionExternaResumenDTO> organizacionesDto = new ArrayList<>();
                
                for (OrganizacionExterna organizacion : evento.getOrganizaciones()) {
                    EventoDTO.OrganizacionExternaResumenDTO organizacionDto = new EventoDTO.OrganizacionExternaResumenDTO(
                        organizacion.getId(),
                        organizacion.getNombre()
                    );
                    organizacionesDto.add(organizacionDto);
                }
                
                dto.setOrganizaciones(organizacionesDto);
            }
        } catch (Exception e) {
            // Log error o manejar excepción
            e.printStackTrace();
        }
        
        return dto;
    }
    
    /**
     * Convierte una lista de entidades Evento a una lista de DTOs básicos
     */
    public static List<EventoDTO> entityListToDtoList(List<Evento> eventos) {
        if (eventos == null) {
            return new ArrayList<>();
        }
        
        return eventos.stream()
            .map(EventoControllerHelper::entityToDto)
            .collect(Collectors.toList());
    }
    
    /**
     * Convierte una lista de entidades Evento a una lista de DTOs con relaciones
     */
    public static List<EventoDTO> entityListToDtoListWithRelations(List<Evento> eventos, 
                                                                UsuarioService usuarioService, 
                                                                InvitadoExternoService invitadoService, 
                                                                OrganizacionExternaService organizacionService) {
        if (eventos == null) {
            return new ArrayList<>();
        }
        
        List<EventoDTO> dtoList = new ArrayList<>();
        for (Evento evento : eventos) {
            dtoList.add(entityToDtoWithRelations(evento, usuarioService, invitadoService, organizacionService));
        }
        
        return dtoList;
    }
    
    /**
     * Actualiza una entidad Evento con los datos de un DTO
     * No actualiza relaciones, esas deben ser manejadas en el controlador
     */
    public static Evento updateEntityFromDto(Evento evento, EventoDTO dto) {
        if (evento == null || dto == null) {
            return evento;
        }
        
        try {
            if (dto.getNombre() != null) {
                evento.setNombre(dto.getNombre());
            }
            
            if (dto.getFecha() != null) {
                evento.setFecha(dto.getFecha());
            }
            
            if (dto.getTipo() != null) {
                evento.setTipo(dto.getTipo());
            }
            
            if (dto.getNombreOrganizador() != null) {
                evento.setNombreOrganizador(dto.getNombreOrganizador());
            }
            
            if (dto.getContactoOrganizador() != null) {
                evento.setContactoOrganizador(dto.getContactoOrganizador());
            }
            
            if (dto.getClave() != null) {
                evento.setClave(dto.getClave());
            }
        } catch (Exception e) {
            // Log error o manejar excepción
            e.printStackTrace();
        }
        
        return evento;
    }
    
    /**
     * Crea un nuevo Evento a partir de un DTO
     * No establece relaciones, esas deben ser manejadas en el controlador
     */
    public static Evento createEventoFromDto(EventoDTO dto) {
        if (dto == null) {
            return null;
        }
        
        Evento evento = new Evento();
        return updateEntityFromDto(evento, dto);
    }
    
    /**
     * Actualiza las relaciones de un Evento a partir de un DTO
     */
    public static void updateEventoRelations(Evento evento, EventoDTO dto, 
                                            EmpresaService empresaService, 
                                            UsuarioService usuarioService,
                                            InvitadoExternoService invitadoService,
                                            OrganizacionExternaService organizacionService) {
        if (evento == null || dto == null) {
            return;
        }
        
        try {
            // Empresa patrocinadora
            if (dto.getEmpresaPatrocinadora() != null && dto.getEmpresaPatrocinadora().getId() != null) {
                Empresa empresa = empresaService.getEmpresaById(dto.getEmpresaPatrocinadora().getId());
                if (empresa != null) {
                    evento.setEmpresaPatrocinadora(empresa);
                }
            }
            
            // Otras relaciones se pueden manejar según sea necesario
            // Por ejemplo, agregar participantes, invitados, etc.
        } catch (Exception e) {
            // Log error o manejar excepción
            e.printStackTrace();
        }
    }
}
