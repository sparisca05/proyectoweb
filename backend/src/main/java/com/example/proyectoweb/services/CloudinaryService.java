package com.example.proyectoweb.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    public CloudinaryService() {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
            "cloud_name", System.getenv("CLOUDINARY_CLOUD_NAME"),
            "api_key", System.getenv("CLOUDINARY_API_KEY"),
            "api_secret", System.getenv("CLOUDINARY_API_SECRET"),
            "secure", true
        ));
    }

    public String uploadImage(MultipartFile file, String folder) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("El archivo está vacío");
        }

        // Validar que sea una imagen
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("El archivo debe ser una imagen");
        }

        // Configurar opciones de upload
        Map<String, Object> params = ObjectUtils.asMap(
                "folder", folder,
                "resource_type", "image",
                "transformation", new Transformation()
                .width(800)
                .height(600)
                .crop("fill")
                .quality("auto")
                .fetchFormat("auto")
        );

        // Subir imagen
        Map result = cloudinary.uploader().upload(file.getBytes(), params);
        
        return (String) result.get("secure_url");
    }

    public String uploadEventImage(MultipartFile file) throws IOException {
        return uploadImage(file, "eventos");
    }

    public String uploadCompanyLogo(MultipartFile file) throws IOException {
        return uploadImage(file, "empresas");
    }

    public void deleteImage(String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }
}
