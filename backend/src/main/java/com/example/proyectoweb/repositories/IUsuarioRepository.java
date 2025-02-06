package com.example.proyectoweb.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.proyectoweb.entity.Usuario;

import java.util.Optional;

public interface IUsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByUsername(String username);

}
