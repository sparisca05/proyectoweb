package com.example.proyectoweb.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.proyectoweb.entity.InvitadoExterno;
import com.example.proyectoweb.repositories.InvitadoExternoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InvitadoExternoService {

    @Autowired
    private final InvitadoExternoRepository invitadoExternoRepository;

    public void saveInvitadoExterno(InvitadoExterno invitadoExterno) {
        invitadoExternoRepository.save(invitadoExterno);
    }

    public List<InvitadoExterno> getAllInvitadosExternos() {
        return invitadoExternoRepository.findAll();
    }

    public InvitadoExterno getInvitadoExternoById(Long invitadoExternoId) {
        return invitadoExternoRepository.findById(invitadoExternoId)
                .orElseThrow(() -> new RuntimeException("Invitado externo no encontrado"));
    }

    public InvitadoExterno getInvitadoExternoByNombre(String nombre) {
        return invitadoExternoRepository.findByNombre(nombre)
                .orElseThrow(() -> new RuntimeException("Invitado externo no encontrado"));
    }

    public void deleteInvitadoExterno(Long invitadoExternoId) {
        invitadoExternoRepository.deleteById(invitadoExternoId);
    }

}
