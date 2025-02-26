package com.example.proyectoweb.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.proyectoweb.entity.Empresa;
import com.example.proyectoweb.repositories.IEmpresaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmpresaService {

    @Autowired
    private final IEmpresaRepository empresaRepository;
    
    public void saveEmpresa(Empresa empresa) {
        empresaRepository.save(empresa);
    }
    
    public Empresa getEmpresaById(Long empresaId) {
        return empresaRepository.findById(empresaId)
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));
    }

    public List<Empresa> getAllEmpresas() {
        return empresaRepository.findAll();
    }
/* 
    public Empresa getEmpresaByNombre(String nombre) {
        return empresaRepository.findByNombre(nombre)
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));
    }
    */

    public void deleteEmpresa(Long empresaId) {
        empresaRepository.deleteById(empresaId);
    }
}
