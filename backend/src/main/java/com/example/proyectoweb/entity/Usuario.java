package com.example.proyectoweb.entity;

import jakarta.persistence.*;
import lombok.*;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "usuario")
@JsonIgnoreProperties({"accountNonExpired", "accountNonLocked", "credentialsNonExpired", "enabled"})
public class Usuario implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "correo_electronico", nullable = false, unique = true)
    private String correo;

    private String nombre;

    private String apellido;

    @Column(nullable = false, unique = true)
    private String username;

    private String password;

    @Enumerated(EnumType.STRING)
    Role rol;

    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return rol.getAuthorities();
    }

    // Agregar relaciones para manejar eliminación en cascada
    @ManyToMany(mappedBy = "participantes", cascade = CascadeType.REMOVE)
    @JsonIgnore
    private List<Evento> eventosParticipante = new ArrayList<>();
    
    @ManyToMany(mappedBy = "ganadores", cascade = CascadeType.REMOVE)
    @JsonIgnore
    private List<Hito> hitosGanados = new ArrayList<>();
    
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<ComentarioEvento> comentarios = new ArrayList<>();
}
