package com.example.proyectoweb.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.example.proyectoweb.entity.Evento;
import com.example.proyectoweb.entity.Usuario;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void enviarCorreoRegistroEvento(Usuario usuario, Evento evento) {
        try {
            SimpleMailMessage mensaje = new SimpleMailMessage();
            mensaje.setFrom(fromEmail);
            mensaje.setTo(usuario.getCorreo());
            mensaje.setSubject("Registro confirmado: " + evento.getNombre());
            String cuerpoMensaje = construirMensajeInscripcion(usuario, evento);
            mensaje.setText(cuerpoMensaje);
    
            mailSender.send(mensaje);
        } catch (Exception e) {
            System.out.print("Error al enviar correo de inscripción a " + usuario.getCorreo() + ": " + e.getMessage());
            // No lanzamos excepción para no interrumpir el proceso de inscripción
        }
    }

    private String construirMensajeInscripcion(Usuario usuario, Evento evento) {
        StringBuilder mensaje = new StringBuilder();
        mensaje.append("¡Hola ").append(usuario.getNombre()).append("!\n\n");
        mensaje.append("Te has inscrito exitosamente al siguiente evento:\n\n");
        mensaje.append("📅 Evento: ").append(evento.getNombre()).append("\n");
        mensaje.append("📍 Fecha: ").append(evento.getFecha()).append("\n");
        mensaje.append("👤 Organizador: ").append(evento.getNombreOrganizador()).append("\n");
        mensaje.append("📧 Contacto: ").append(evento.getContactoOrganizador()).append("\n");
        mensaje.append("🎯 Tipo: ").append(evento.getTipo()).append("\n\n");
        
        if (!evento.isPublico()) {
            mensaje.append("🔒 Este es un evento privado.\n\n");
        }
        
        mensaje.append("¡Nos vemos en el evento!\n\n");
        mensaje.append("Saludos,\n");
        mensaje.append("El equipo organizador");
        
        return mensaje.toString();
    }
}
