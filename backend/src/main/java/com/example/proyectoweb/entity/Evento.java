package com.example.proyectoweb.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "evento")
public class Evento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyy")
    @Temporal(TemporalType.TIMESTAMP)
    private Date fecha;

    @Column(name = "tipo_evento", nullable = false)
    private String tipo;

    @Column(name = "clave_evento")
    private String clave = GenerarClave();

    // Método para generar una clave aleatoria
    public String GenerarClave() {
        String caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        String clave = "";
        for (int i = 0; i < 10; i++) {
            clave += caracteres.charAt((int) (Math.random() * caracteres.length()));
        }
        return clave;
    }

    @Column(name = "empresa_patrocinadora")
    private Empresa empresaPatrocinadora;

    // Tabla de participantes del evento
    @ManyToMany()
    @JoinTable(name = "evento_usuario", joinColumns = @JoinColumn(name = "evento_id"), inverseJoinColumns = @JoinColumn(name = "usuario_id"))
    private List<Usuario> participantes = new ArrayList<>();;

    public List<String> getParticipantes() {
        List<String> usernames = this.participantes.stream().map(Usuario::getUsername).toList();
        return usernames;
    }

    public void addParticipante(Usuario usuario) {
        this.participantes.add(usuario);
    }

    public void removeParticipante(Usuario usuario) {
        this.participantes.remove(usuario);
    }

    // Tabla de invitados externos en el evento
    @ManyToMany()
    @JoinTable(name = "evento_invitado", joinColumns = @JoinColumn(name = "evento_id"), inverseJoinColumns = @JoinColumn(name = "invitado_id"))
    private List<InvitadoExterno> invitados = new ArrayList<>();

    public List<String> getInvitados() {
        List<String> nombres = this.invitados.stream().map(InvitadoExterno::getNombre).toList();
        return nombres;
    }

    public void addInvitado(InvitadoExterno invitado) {
        this.invitados.add(invitado);
    }

    public void removeInvitado(InvitadoExterno invitado) {
        this.invitados.remove(invitado);
    }

    // Tabla de Organizaciones participantes en el evento
    @ManyToMany()
    @JoinTable(name = "evento_organizacion", joinColumns = @JoinColumn(name = "evento_id"), inverseJoinColumns = @JoinColumn(name = "organizacion_id"))
    private List<OrganizacionExterna> organizaciones = new ArrayList<>();

    public List<String> getOrganizaciones() {
        List<String> nombres = this.organizaciones.stream().map(OrganizacionExterna::getNombre).toList();
        return nombres;
    }

    public void addOrganizacion(OrganizacionExterna organizacion) {
        this.organizaciones.add(organizacion);
    }

    public void removeOrganizacion(OrganizacionExterna organizacion) {
        this.organizaciones.remove(organizacion);
    }

}
