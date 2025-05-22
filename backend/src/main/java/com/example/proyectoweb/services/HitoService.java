package com.example.proyectoweb.services;
import com.example.proyectoweb.entity.Hito;
import com.example.proyectoweb.repositories.IHitoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HitoService  {

    @Autowired
    private final IHitoRepository hitoRepository;

    public List<Hito> getAllHitos() {
        return hitoRepository.findAll();
    }

    public Hito getHitoById(Long id) {
        Optional<Hito> hito = hitoRepository.findById(id);
        return hito.orElse(null);
    }

    public Hito createHito(Hito hito) {
        return hitoRepository.save(hito);
    }

    public Hito updateHito(Long id, Hito updatedHito) {
        Optional<Hito> existingHito = hitoRepository.findById(id);
        if (existingHito.isPresent()) {
            updatedHito.setId(id); 
            return hitoRepository.save(updatedHito);
        }
        return null; 
    }

    public Hito saveHito(Hito hito) {
        return hitoRepository.save(hito);
    }

    public void deleteHito(Long id) {
        hitoRepository.deleteById(id);
    }

    public Hito getInvitadoExternoByNombre(String nombre) {
        return hitoRepository.findByNombre(nombre)
                .orElseThrow(() -> new RuntimeException("Hito no encontrado"));
    }
}
