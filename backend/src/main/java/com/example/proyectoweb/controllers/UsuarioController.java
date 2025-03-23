package com.example.proyectoweb.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.proyectoweb.entity.Evento;
import com.example.proyectoweb.entity.Usuario;
import com.example.proyectoweb.entity.UsuarioInfo;
import com.example.proyectoweb.services.UsuarioService;

@RestController
@RequestMapping("api/v1/usuario")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // Obtener todos los usuarios
    @GetMapping()
    public ResponseEntity<List<Usuario>> getAllUsuarios() {
        return ResponseEntity.ok(usuarioService.obtenerTodos());
    }

    // Información de usuario
    @GetMapping("/{id}")
    public UsuarioInfo getUserInfo(@PathVariable Long id) {
        return usuarioService.getUserInfoById(id);
    }

    // Información de perfil propio
    @GetMapping("/perfil")
    public Usuario getUserProfile() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName(); // Obtener el username del
                                                                                            // usuario autenticado
        return usuarioService.getUserByUsername(username);
    }

    // Eventos de usuario
    @GetMapping("/mis-eventos")
    public ResponseEntity<List<Evento>> getEventosByUsuario() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName(); // Obtener el username del
                                                                                            // usuario autenticado
        Long id = usuarioService.getUserByUsername(username).getId();
        List<Evento> eventos = usuarioService.getMyEvents(id);
        return ResponseEntity.ok(eventos);
    }

    // Editar perfil
    @PutMapping("/perfil")
    public Usuario updateUserProfile(@RequestBody Usuario request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName(); // Obtener el username del
                                                                                            // usuario autenticado
        Long id = usuarioService.getUserByUsername(username).getId();
        return usuarioService.updateUserById(request, id);
    }

    // Eliminar perfil
    @DeleteMapping("/perfil")
    public String deleteUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName(); // Obtener el username del
                                                                                            // usuario autenticado
        return usuarioService.deleteUser(usuarioService.getUserByUsername(username).getId());
    }
}
