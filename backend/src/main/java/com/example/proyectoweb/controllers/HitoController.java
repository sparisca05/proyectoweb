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

import com.example.proyectoweb.entity.Hito;
import com.example.proyectoweb.services.HitoService;

@RestController
@RequestMapping("api/v1/hitos")
public class HitoController {

    @Autowired
    private HitoService hitoService;

    // Ver todos los hitos
    @GetMapping
    public ResponseEntity<List<Hito>> getAllHitos() {
        try {
            List<Hito> hitos = hitoService.getAllHitos();
            return ResponseEntity.ok(hitos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Ver un hito por su ID
    @GetMapping("/{id}")
    public Hito getHitoById(@PathVariable Long id) {
        return hitoService.getHitoById(id);
    }

    // Inscribir un nuevo hito
    @PostMapping
    public String postHito(@RequestBody Hito hito) {
        hitoService.saveHito(hito);
        return "Hito registrado con éxito";
    }

    // Eliminar un hito
    @DeleteMapping("/{id}")
    public String deleteHito(@PathVariable Long id) {
        hitoService.deleteHito(id);
        return "Hito eliminado con éxito";
    }
}
