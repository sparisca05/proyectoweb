package com.example.proyectoweb.repositories;

import com.example.proyectoweb.entity.Hito;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface IHitoRepository extends JpaRepository<Hito, Long> {
    Optional<Hito> findByNombre(String nombre);
}