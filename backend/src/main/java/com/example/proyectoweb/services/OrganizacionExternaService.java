package com.example.proyectoweb.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import com.example.proyectoweb.repositories.IOrganizacionExternaRepository;
import com.example.proyectoweb.entity.OrganizacionExterna;

@Service
@RequiredArgsConstructor
public class OrganizacionExternaService {
    
    @Autowired
    private final IOrganizacionExternaRepository organizacionExternaRepository;

    public void saveOrganizacionExterna(OrganizacionExterna organizacionExterna) {
        organizacionExternaRepository.save(organizacionExterna);
    }

    public OrganizacionExterna getOrganizacionExternaById(Long organizacionExternaId) {
        return organizacionExternaRepository.findById(organizacionExternaId)
                .orElseThrow(() -> new RuntimeException("Organizacion externa no encontrada"));
    }
/* 
    public OrganizacionExterna getOrganizacionExternaByNombre(String nombre) {
        return organizacionExternaRepository.findByNombre(nombre)
                .orElseThrow(() -> new RuntimeException("Organizacion externa no encontrada"));
    }
    */

    public void deleteOrganizacionExterna(Long organizacionExternaId) {
        organizacionExternaRepository.deleteById(organizacionExternaId);
    }

}
