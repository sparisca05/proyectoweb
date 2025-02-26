package com.example.proyectoweb.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.proyectoweb.entity.OrganizacionExterna;
import com.example.proyectoweb.services.OrganizacionExternaService;

@RestController
@RequestMapping("api/v1/org-externa")
public class OrganizazionExternaController {

    @Autowired
    private OrganizacionExternaService organizacionExternaService;

    // Ver todos los organizadores externos
    @GetMapping
    public ResponseEntity<List<OrganizacionExterna>> getOrganizaciones() {
        List<OrganizacionExterna> organizaciones = organizacionExternaService.getAllOrganizacionesExternas();
        return ResponseEntity.ok(organizaciones);
    }

    // Ver un organizador externo por su id
    @GetMapping("/{id}")
    public OrganizacionExterna getOrganizacionById(Long id) {
        return organizacionExternaService.getOrganizacionExternaById(id);
    }

    // Inscribir un organizador externo
    @PostMapping
    public String postOrganizacion(@RequestBody OrganizacionExterna organizacionExterna) {
        organizacionExternaService.saveOrganizacionExterna(new OrganizacionExterna());
        return "Organización externa inscrita con éxito";
    }

    // Eliminar un organizador externo
    @DeleteMapping
    public String deleteOrganizacion(Long id) {
        organizacionExternaService.deleteOrganizacionExterna(id);
        return "Organización externa eliminada con éxito";
    }

}
