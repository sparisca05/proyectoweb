package com.example.parcialFashionEvent.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.nio.file.Path;

@Data
@Entity
@Table(name = "empresa")
public class Empresa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    @Column(nullable = false)
    private String descripcion;

    private Path logo;

}
