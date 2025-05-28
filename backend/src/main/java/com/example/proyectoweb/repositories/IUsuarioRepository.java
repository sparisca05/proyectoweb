package com.example.proyectoweb.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.proyectoweb.entity.Usuario;

import jakarta.transaction.Transactional;

import java.util.Optional;

public interface IUsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByUsername(String username);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM comentarios_evento WHERE usuario_id = :usuarioId", nativeQuery = true)
    void deleteComentariosByUsuario(@Param("usuarioId") Long usuarioId);
    
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM evento_usuario WHERE usuario_id = :usuarioId", nativeQuery = true)
    void removeUserFromEventos(@Param("usuarioId") Long usuarioId);
    
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM ganadores WHERE usuario_id = :usuarioId", nativeQuery = true)
    void removeUserFromHitos(@Param("usuarioId") Long usuarioId);

}
