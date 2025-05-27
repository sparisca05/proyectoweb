package com.example.proyectoweb.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmpresaUpdateDTO {
    private String nombre;
    private String descripcion;
    private String logoUrl;
}
