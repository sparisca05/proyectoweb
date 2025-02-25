package com.example.proyectoweb.entity;


import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Data;

    @Data
    @Entity
    @Table(name = "hito")
public class Hito {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    @Column(name = "categoria", nullable = false)
    private String categoria;
    
    @Column(name="evento_relevante",nullable = false)
    private Evento evento;

     @ManyToMany()
    @JoinTable(name = "ganadores", joinColumns = @JoinColumn(name = "hito_id"), inverseJoinColumns = @JoinColumn(name = "usuario_id"))
    private List<Usuario> ganadores = new ArrayList<>();;

    public List<String> getGanadores() {
        List<String> usernames = this.ganadores.stream().map(Usuario::getUsername).toList();
        return usernames;
    }

    public void addGanadores(Usuario usuario) {
        this.ganadores.add(usuario);
    }

    public void removeGanadores(Usuario usuario) {
        this.ganadores.remove(usuario);
    }
}
