package com.example.proyectoweb.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "eventos")
public class Evento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy HH:mm")
    private LocalDateTime fecha;

    @Column(name = "tipo_evento", nullable = false)
    private String tipo;

    @Column(nullable = false)
    private String nombreOrganizador;

    @Column(nullable = false)
    private String contactoOrganizador;

    @Column(nullable = false)
    private boolean isPublico = true;

    // Método para generar una clave aleatoria
    public String generarClave() {
        String caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        String c = "";
        for (int i = 0; i < 10; i++) {
            c += caracteres.charAt((int) (Math.random() * caracteres.length()));
        }
        return c;
    }    @Column(name = "clave_evento")
    private String clave = generarClave();

    @Column(name = "imagen_url")
    private String imagenUrl;

    // Tabla de hitos del evento
    @OneToMany(
        mappedBy = "eventoRelevante",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    @JsonManagedReference
    private List<Hito> hitos;

    // Tabla de empresa patrocinadora del evento
    @ManyToOne
    @JoinColumn(name = "empresa_patrocinadora_id", nullable = false)
    @JsonBackReference
    private Empresa empresaPatrocinadora;

    // Tabla de participantes del evento
    @ManyToMany()
    @JoinTable(
        name = "evento_usuario",
        joinColumns = @JoinColumn(name = "evento_id"),
        inverseJoinColumns = @JoinColumn(name = "usuario_id")
    )
    private List<Usuario> participantes = new ArrayList<>();

    public List<String> getUsernamesParticipantes() {
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
    @JoinTable(
        name = "evento_invitado",
        joinColumns = @JoinColumn(name = "evento_id"),
        inverseJoinColumns = @JoinColumn(name = "invitado_id")
    )
    private List<InvitadoExterno> invitados = new ArrayList<>();

    public List<String> getNombresInvitados() {
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
    @JoinTable(
        name = "evento_organizacion",
        joinColumns = @JoinColumn(name = "evento_id"),
        inverseJoinColumns = @JoinColumn(name = "organizacion_id")
    )
    private List<OrganizacionExterna> organizaciones = new ArrayList<>();

    public List<String> getNombresOrganizaciones() {
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
