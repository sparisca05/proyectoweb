package com.example.proyectoweb.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarCorreoRegistroEvento(String destinatario, String nombreUsuario, String nombreEvento) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setTo(destinatario);
        mensaje.setSubject("Registro confirmado: " + nombreEvento);
        mensaje.setText("Hola " + nombreUsuario + ",\n\n" +
                "Te has registrado exitosamente al evento: " + nombreEvento + ".\n\n" +
                "Gracias por tu participación.\n\n" +
                "Saludos,\nEquipo de Eventos");

        mailSender.send(mensaje);
    }
}
