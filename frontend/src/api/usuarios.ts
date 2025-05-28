import axios from "axios";
import { API_URL } from "../main.tsx";
import { Usuario } from "../contexts/UsuarioContext";
import { Evento } from "../screens/Eventos.tsx";
import { getToken } from "../screens/Home.tsx";
import { NumberLiteralType } from "typescript";

export const getUsuarios = async (): Promise<Usuario[]> => {
    const response = await axios
        .get(`${API_URL}/api/v1/usuario`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
    return response.data;
}

export const getUsuarioById = async (id: NumberLiteralType): Promise<Usuario> => {
    const response = await axios.get(`${API_URL}/api/v1/usuario/${id}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
    return response.data;
}

export const getPerfil = async (): Promise<Usuario> => {
    const response = await axios.get(`${API_URL}/api/v1/usuario/perfil`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
    return response.data;
}

export const getEventosUsuario = async (): Promise<Evento[]> => {
    const response = await axios.get(`${API_URL}/api/v1/usuario/mis-eventos`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    }
    );
    return response.data;
}

export const updateUsuario = async (usuario: Usuario): Promise<Usuario> => {
    const response = await axios.put(`${API_URL}/api/v1/usuario/${usuario.id}`, usuario, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
    return response.data;
}

export const deleteAccount = async (): Promise<void> => {
    await axios.delete(`${API_URL}/api/v1/usuario/perfil`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
}

export const deleteUsuarioById = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/api/v1/usuario/${id}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
}