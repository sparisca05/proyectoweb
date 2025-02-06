package com.example.proyectoweb.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.proyectoweb.entity.InvitadoExterno;

public interface InvitadoExternoRepository extends JpaRepository<InvitadoExterno, Long> {

    Optional<InvitadoExterno> findByNombre(String nombre);

}
