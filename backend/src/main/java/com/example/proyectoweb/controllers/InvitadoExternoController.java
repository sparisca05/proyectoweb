package com.example.proyectoweb.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.proyectoweb.entity.InvitadoExterno;
import com.example.proyectoweb.services.InvitadoExternoService;

@RestController
@RequestMapping("api/v1/invitados-externos")
public class InvitadoExternoController {
    
    @Autowired
    private InvitadoExternoService invitadoExternoService;

    // Ver todos los invitados externos
    @GetMapping
    public ResponseEntity<List<InvitadoExterno>> getInvitadosExternos() {
        List<InvitadoExterno> invitadosExternos = invitadoExternoService.getAllInvitadosExternos();
        return ResponseEntity.ok(invitadosExternos);
    }

    // Ver un invitado externo por su id
    @GetMapping("/{id}")
    public InvitadoExterno getInvitadoExternoById(@PathVariable Long id) {
        return invitadoExternoService.getInvitadoExternoById(id);
    }

    // Ver un invitado externo por su nombre
    @GetMapping("/nombre/{nombre}")
    public InvitadoExterno getInvitadoExternoByNombre(@PathVariable String nombre) {
        return invitadoExternoService.getInvitadoExternoByNombre(nombre);
    }

    // Inscribir un invitado externo
    @PostMapping
    public String postInvitadoExterno(@RequestBody InvitadoExterno invitadoExterno) {
        invitadoExternoService.saveInvitadoExterno(invitadoExterno);
        return "Invitado externo creado con éxito";
    }

    // Eliminar un invitado externo
    @DeleteMapping("/{id}")
    public String deleteInvitadoExterno(@PathVariable Long id) {
        invitadoExternoService.deleteInvitadoExterno(id);
        return "Invitado externo eliminado con éxito";
    }
    
}
