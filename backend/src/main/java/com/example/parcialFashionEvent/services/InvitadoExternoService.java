package com.example.parcialFashionEvent.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.parcialFashionEvent.entity.InvitadoExterno;
import com.example.parcialFashionEvent.repositories.InvitadoExternoRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InvitadoExternoService {

    @Autowired
    private final InvitadoExternoRepository invitadoExternoRepository;

    public void saveInvitadoExterno(InvitadoExterno invitadoExterno) {
        invitadoExternoRepository.save(invitadoExterno);
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
