package com.example.parcialFashionEvent.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.parcialFashionEvent.entity.InvitadoExterno;

public interface InvitadoExternoRepository extends JpaRepository<InvitadoExterno, Long> {

    Optional<InvitadoExterno> findByNombre(String nombre);

}
