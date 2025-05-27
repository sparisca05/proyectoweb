package com.example.proyectoweb.controllers;

import com.example.proyectoweb.services.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/upload")
public class UploadController {

    @Autowired
    private CloudinaryService cloudinaryService;

    @PostMapping("/evento-imagen")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> uploadEventImage(@RequestParam("imagen") MultipartFile file) {
        try {
            String imageUrl = cloudinaryService.uploadEventImage(file);
            
            Map<String, String> response = new HashMap<>();
            response.put("url", imageUrl);
            response.put("message", "Imagen subida exitosamente");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/empresa-logo")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> uploadCompanyLogo(@RequestParam("imagen") MultipartFile file) {
        try {
            String logoUrl = cloudinaryService.uploadCompanyLogo(file);
            
            Map<String, String> response = new HashMap<>();
            response.put("url", logoUrl);
            response.put("message", "Logo subido exitosamente");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
