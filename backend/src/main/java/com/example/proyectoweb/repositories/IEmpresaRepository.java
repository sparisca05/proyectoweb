package com.example.proyectoweb.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.proyectoweb.entity.Empresa;

public interface IEmpresaRepository extends JpaRepository<Empresa, Long> {
    
}
