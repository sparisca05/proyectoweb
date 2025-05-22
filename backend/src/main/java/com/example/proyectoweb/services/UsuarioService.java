package com.example.proyectoweb.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.proyectoweb.entity.Evento;
import com.example.proyectoweb.entity.Usuario;
import com.example.proyectoweb.entity.UsuarioInfo;
import com.example.proyectoweb.repositories.IEventoRepository;
import com.example.proyectoweb.repositories.IUsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioService implements UserDetailsService {

    @Autowired
    private IUsuarioRepository userRepository;
    private final IEventoRepository eventoRepository;
    private final PasswordEncoder passwordEncoder;

    public void saveUser(Usuario user) {
        // Encripta la contraseña antes de guardarla
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // Guarda el usuario en la base de datos
        userRepository.save(user);
        System.out.println("Usuario guardado con éxito");
    }

    public List<Usuario> obtenerTodos() {
        return userRepository.findAll();
    }

    public UsuarioInfo getUserInfoById(Long userId) {
        Usuario user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        UsuarioInfo userInfo = new UsuarioInfo();
        userInfo.setId(user.getId());
        userInfo.setNombre(user.getNombre());
        userInfo.setApellido(user.getApellido());
        userInfo.setUsername(user.getUsername());
        return userInfo;
    }

    public Usuario getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Usuario> userDetail = userRepository.findByUsername(username);

        return userDetail.map(user -> new org.springframework.security.core.userdetails.User(
                user.getCorreo(),
                user.getPassword(),
                user.getAuthorities())).orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    public List<Evento> getMyEvents(Long userId) {
        return eventoRepository.getEventosByUsuario(userId);
    }

    public Usuario updateUserById(Usuario request, Long userId) {
        Usuario user = userRepository.findById(userId).get();

        if (!(request.getNombre() == null || request.getNombre().isEmpty())) {
            user.setNombre(request.getNombre());
        }
        if (!(request.getApellido() == null || request.getApellido().isEmpty())) {
            user.setApellido(request.getApellido());
        }
        if (!(request.getUsername() == null || request.getUsername().isEmpty())) {
            user.setUsername(request.getUsername());
        }
        if (!(request.getCorreo() == null || request.getCorreo().isEmpty())) {
            user.setCorreo(request.getCorreo());
        }
        if (!(request.getPassword() == null || request.getPassword().isEmpty())) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        userRepository.save(user);

        return user;
    }

    public void updateUserRole(Usuario request, Long userId) {
        Usuario user = userRepository.findById(userId).get();

        user.setRol(request.getRol());

        userRepository.save(user);
    }

    public String deleteUser(Long userId) {
        Usuario user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        userRepository.delete(user);
        return "Usuario eliminado";
    }

}
