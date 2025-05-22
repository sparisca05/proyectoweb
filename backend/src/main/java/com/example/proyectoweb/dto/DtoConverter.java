package com.example.proyectoweb.dto;

import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;

import com.example.proyectoweb.entity.Empresa;
import com.example.proyectoweb.entity.Evento;
import com.example.proyectoweb.entity.Hito;
import com.example.proyectoweb.entity.InvitadoExterno;
import com.example.proyectoweb.entity.OrganizacionExterna;
import com.example.proyectoweb.entity.Role;
import com.example.proyectoweb.entity.Usuario;

/**
 * Clase utilitaria para convertir entre entidades y DTOs
 */
public class DtoConverter {

    // ================== HITO ==================
    
    /**
     * Convierte una entidad Hito a un DTO
     */
    public static HitoDTO convertToHitoDto(Hito hito) {
        if (hito == null) return null;
        
        HitoDTO dto = new HitoDTO();
        dto.setId(hito.getId());
        dto.setNombre(hito.getNombre());
        dto.setCategoria(hito.getCategoria());
        
        // Convertir evento relevante
        if (hito.getEventoRelevante() != null) {
            dto.setEventoRelevanteId(hito.getEventoRelevante().getId());
            
            HitoDTO.EventoResumenDTO eventoDto = new HitoDTO.EventoResumenDTO(
                hito.getEventoRelevante().getId(),
                hito.getEventoRelevante().getNombre()
            );
            dto.setEventoRelevante(eventoDto);
        }
        
        // Los ganadores en Hito son una lista de usernames (String)
        List<HitoDTO.UsuarioResumenDTO> ganadoresDto = new ArrayList<>();
        // Simplemente creamos DTOs con el username, dejando los demás campos como null
        if (hito.getGanadores() != null && !hito.getGanadores().isEmpty()) {
            for (String username : hito.getGanadores()) {
                HitoDTO.UsuarioResumenDTO usuarioDto = new HitoDTO.UsuarioResumenDTO(
                    null, // id
                    username, // username
                    null, // nombre
                    null  // apellido
                );
                ganadoresDto.add(usuarioDto);
            }
            dto.setGanadores(ganadoresDto);
        }
        
        return dto;
    }
    
    /**
     * Convierte una lista de entidades Hito a una lista de DTOs
     */
    public static List<HitoDTO> convertToHitoDtoList(List<Hito> hitos) {
        if (hitos == null) return new ArrayList<>();
        return hitos.stream()
            .map(DtoConverter::convertToHitoDto)
            .collect(Collectors.toList());
    }
    
    /**
     * Convierte un DTO a una entidad Hito (para creación o actualización)
     * No incluye referencias a otras entidades, esas deben ser manejadas manualmente
     */
    public static Hito convertToHitoEntity(HitoDTO dto) {
        if (dto == null) return null;
        
        Hito hito = new Hito();
        if (dto.getId() != null) {
            hito.setId(dto.getId());
        }
        hito.setNombre(dto.getNombre());
        hito.setCategoria(dto.getCategoria());
        
        // Las referencias a otras entidades deben manejarse en el servicio
        return hito;
    }

    // ================== EVENTO ==================
    
    /**
     * Convierte una entidad Evento a un DTO
     */
    public static EventoDTO convertToEventoDto(Evento evento) {
        if (evento == null) return null;
        
        EventoDTO dto = new EventoDTO();
        dto.setId(evento.getId());
        dto.setNombre(evento.getNombre());
        dto.setFecha(evento.getFecha());
        dto.setTipo(evento.getTipo());
        dto.setNombreOrganizador(evento.getNombreOrganizador());
        dto.setContactoOrganizador(evento.getContactoOrganizador());
        dto.setClave(evento.getClave());
        
        // Convertir hitos
        if (evento.getHitos() != null && !evento.getHitos().isEmpty()) {
            dto.setHitos(
                evento.getHitos().stream()
                    .map(hito -> new EventoDTO.HitoResumenDTO(
                        hito.getId(),
                        hito.getNombre(),
                        hito.getCategoria()
                    ))
                    .collect(Collectors.toList())
            );
        }
        
        // Convertir empresa patrocinadora
        if (evento.getEmpresaPatrocinadora() != null) {
            dto.setEmpresaPatrocinadora(new EventoDTO.EmpresaResumenDTO(
                evento.getEmpresaPatrocinadora().getId(),
                evento.getEmpresaPatrocinadora().getNombre()
            ));
        }
        
        // Convertir participantes
        if (evento.getParticipantes() != null && !evento.getParticipantes().isEmpty()) {
            dto.setParticipantes(
                evento.getParticipantes().stream()
                    .map(usuario -> new EventoDTO.UsuarioResumenDTO(
                        usuario.getId(),
                        usuario.getUsername(),
                        usuario.getNombre(),
                        usuario.getApellido()
                    ))
                    .collect(Collectors.toList())
            );
        }
        
        // Convertir invitados
        if (evento.getInvitados() != null && !evento.getInvitados().isEmpty()) {
            dto.setInvitados(
                evento.getInvitados().stream()
                    .map(invitado -> new EventoDTO.InvitadoExternoResumenDTO(
                        invitado.getId(),
                        invitado.getNombre(),
                        invitado.getApellido()
                    ))
                    .collect(Collectors.toList())
            );
        }
        
        // Convertir organizaciones
        if (evento.getOrganizaciones() != null && !evento.getOrganizaciones().isEmpty()) {
            dto.setOrganizaciones(
                evento.getOrganizaciones().stream()
                    .map(org -> new EventoDTO.OrganizacionExternaResumenDTO(
                        org.getId(),
                        org.getNombre()
                    ))
                    .collect(Collectors.toList())
            );
        }
        
        return dto;
    }
    
    /**
     * Convierte una lista de entidades Evento a una lista de DTOs
     */
    public static List<EventoDTO> convertToEventoDtoList(List<Evento> eventos) {
        if (eventos == null) return new ArrayList<>();
        return eventos.stream()
            .map(DtoConverter::convertToEventoDto)
            .collect(Collectors.toList());
    }
    
    /**
     * Convierte un DTO a una entidad Evento (para creación o actualización)
     * No incluye referencias a otras entidades, esas deben ser manejadas manualmente
     */
    public static Evento convertToEventoEntity(EventoDTO dto) {
        if (dto == null) return null;
        
        Evento evento = new Evento();
        if (dto.getId() != null) {
            evento.setId(dto.getId());
        }
        evento.setNombre(dto.getNombre());
        evento.setFecha(dto.getFecha());
        evento.setTipo(dto.getTipo());
        evento.setNombreOrganizador(dto.getNombreOrganizador());
        evento.setContactoOrganizador(dto.getContactoOrganizador());
        if (dto.getClave() != null) {
            evento.setClave(dto.getClave());
        }
        
        // Las referencias a otras entidades deben manejarse en el servicio
        return evento;
    }
    
    // ================== USUARIO ==================
    
    /**
     * Convierte una entidad Usuario a un DTO
     */
    public static UsuarioDTO convertToUsuarioDto(Usuario usuario) {
        if (usuario == null) return null;
        
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(usuario.getId());
        dto.setCorreo(usuario.getCorreo());
        dto.setNombre(usuario.getNombre());
        dto.setApellido(usuario.getApellido());
        dto.setUsername(usuario.getUsername());
        
        if (usuario.getRol() != null) {
            dto.setRol(usuario.getRol().name());
        }
        
        return dto;
    }
    
    /**
     * Convierte una lista de entidades Usuario a una lista de DTOs
     */
    public static List<UsuarioDTO> convertToUsuarioDtoList(List<Usuario> usuarios) {
        if (usuarios == null) return new ArrayList<>();
        return usuarios.stream()
            .map(DtoConverter::convertToUsuarioDto)
            .collect(Collectors.toList());
    }
    
    /**
     * Convierte un DTO a una entidad Usuario (para actualización)
     * No establece la contraseña ni rol, eso debe hacerse manualmente
     */
    public static Usuario convertToUsuarioEntity(UsuarioDTO dto) {
        if (dto == null) return null;
        
        Usuario usuario = new Usuario();
        if (dto.getId() != null) {
            usuario.setId(dto.getId());
        }
        usuario.setCorreo(dto.getCorreo());
        usuario.setNombre(dto.getNombre());
        usuario.setApellido(dto.getApellido());
        usuario.setUsername(dto.getUsername());
        
        if (dto.getRol() != null) {
            try {
                usuario.setRol(Role.valueOf(dto.getRol()));
            } catch (IllegalArgumentException e) {
                // Ignorar si el rol no es válido
            }
        }
        
        return usuario;
    }
    
    // ================== EMPRESA ==================
    
    /**
     * Convierte una entidad Empresa a un DTO
     */
    public static EmpresaDTO convertToEmpresaDto(Empresa empresa) {
        if (empresa == null) return null;
        
        EmpresaDTO dto = new EmpresaDTO();
        dto.setId(empresa.getId());
        dto.setNombre(empresa.getNombre());
        dto.setDescripcion(empresa.getDescripcion());
        dto.setLogo(empresa.getLogo());
        
        // Convertir eventos
        if (empresa.getEventos() != null && !empresa.getEventos().isEmpty()) {
            dto.setEventos(
                empresa.getEventos().stream()
                    .map(evento -> new EmpresaDTO.EventoResumenDTO(
                        evento.getId(),
                        evento.getNombre()
                    ))
                    .collect(Collectors.toList())
            );
        }
        
        return dto;
    }
    
    /**
     * Convierte una lista de entidades Empresa a una lista de DTOs
     */
    public static List<EmpresaDTO> convertToEmpresaDtoList(List<Empresa> empresas) {
        if (empresas == null) return new ArrayList<>();
        return empresas.stream()
            .map(DtoConverter::convertToEmpresaDto)
            .collect(Collectors.toList());
    }
    
    /**
     * Convierte un DTO a una entidad Empresa (para creación o actualización)
     */
    public static Empresa convertToEmpresaEntity(EmpresaDTO dto) {
        if (dto == null) return null;
        
        Empresa empresa = new Empresa();
        if (dto.getId() != null) {
            empresa.setId(dto.getId());
        }
        empresa.setNombre(dto.getNombre());
        empresa.setDescripcion(dto.getDescripcion());
        empresa.setLogo(dto.getLogo());
        
        // No establecemos los eventos, eso debe manejarse manualmente
        return empresa;
    }
    
    // ================== INVITADO EXTERNO ==================
    
    /**
     * Convierte una entidad InvitadoExterno a un DTO
     */
    public static InvitadoExternoDTO convertToInvitadoExternoDto(InvitadoExterno invitado) {
        if (invitado == null) return null;
        
        InvitadoExternoDTO dto = new InvitadoExternoDTO();
        dto.setId(invitado.getId());
        dto.setNombre(invitado.getNombre());
        dto.setApellido(invitado.getApellido());
        dto.setDescripcionRol(invitado.getDescripcionRol());
        
        return dto;
    }
    
    /**
     * Convierte una lista de entidades InvitadoExterno a una lista de DTOs
     */
    public static List<InvitadoExternoDTO> convertToInvitadoExternoDtoList(List<InvitadoExterno> invitados) {
        if (invitados == null) return new ArrayList<>();
        return invitados.stream()
            .map(DtoConverter::convertToInvitadoExternoDto)
            .collect(Collectors.toList());
    }
    
    /**
     * Convierte un DTO a una entidad InvitadoExterno (para creación o actualización)
     */
    public static InvitadoExterno convertToInvitadoExternoEntity(InvitadoExternoDTO dto) {
        if (dto == null) return null;
        
        InvitadoExterno invitado = new InvitadoExterno();
        if (dto.getId() != null) {
            invitado.setId(dto.getId());
        }
        invitado.setNombre(dto.getNombre());
        invitado.setApellido(dto.getApellido());
        invitado.setDescripcionRol(dto.getDescripcionRol());
        
        return invitado;
    }
    
    // ================== ORGANIZACIÓN EXTERNA ==================
    
    /**
     * Convierte una entidad OrganizacionExterna a un DTO
     */
    public static OrganizacionExternaDTO convertToOrganizacionExternaDto(OrganizacionExterna organizacion) {
        if (organizacion == null) return null;
        
        OrganizacionExternaDTO dto = new OrganizacionExternaDTO();
        dto.setId(organizacion.getId());
        dto.setNombre(organizacion.getNombre());
        dto.setDescripcion(organizacion.getDescripcion());
        dto.setLogo(organizacion.getLogo());
        
        return dto;
    }
    
    /**
     * Convierte una lista de entidades OrganizacionExterna a una lista de DTOs
     */
    public static List<OrganizacionExternaDTO> convertToOrganizacionExternaDtoList(List<OrganizacionExterna> organizaciones) {
        if (organizaciones == null) return new ArrayList<>();
        return organizaciones.stream()
            .map(DtoConverter::convertToOrganizacionExternaDto)
            .collect(Collectors.toList());
    }
    
    /**
     * Convierte un DTO a una entidad OrganizacionExterna (para creación o actualización)
     */
    public static OrganizacionExterna convertToOrganizacionExternaEntity(OrganizacionExternaDTO dto) {
        if (dto == null) return null;
        
        OrganizacionExterna organizacion = new OrganizacionExterna();
        if (dto.getId() != null) {
            organizacion.setId(dto.getId());
        }
        organizacion.setNombre(dto.getNombre());
        organizacion.setDescripcion(dto.getDescripcion());
        organizacion.setLogo(dto.getLogo());
        
        return organizacion;
    }
}
