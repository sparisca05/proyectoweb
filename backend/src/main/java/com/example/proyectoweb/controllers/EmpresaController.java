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

import com.example.proyectoweb.entity.Empresa;
import com.example.proyectoweb.services.EmpresaService;

@RestController
@RequestMapping("api/v1/empresas")
public class EmpresaController {

    @Autowired
    private EmpresaService empresaService;

    // Ver todas las empresas
    @GetMapping
    public ResponseEntity<List<Empresa>> getEmpresas() {
        List<Empresa> empresas = empresaService.getAllEmpresas();
        return ResponseEntity.ok(empresas);
    }

    // Ver una empresa por su id
    @GetMapping("/{id}")
    public Empresa getEmpresaById(@PathVariable Long id) {
        return empresaService.getEmpresaById(id);
    }

    // Inscribir una empresa
    @PostMapping
    public String postEmpresa(@RequestBody Empresa empresa) {
        empresaService.saveEmpresa(empresa);
        return "Empresa inscrita con éxito";
    }
    
    // Eliminar una empresa
    @DeleteMapping("/{id}")
    public String deleteEmpresa(@PathVariable Long id) {
        empresaService.deleteEmpresa(id);
        return "Empresa eliminada con éxito";
    }
    
}
