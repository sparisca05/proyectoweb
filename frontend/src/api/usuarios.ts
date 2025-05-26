import axios from "axios";
import { API_URL } from "../main.tsx";
import { Usuario } from "../contexts/UsuarioContext";
import { Evento } from "../screens/Eventos.tsx";

export const getUsuarios = async (token: string): Promise<Usuario[]> => {
    const response = await axios
        .get(`${API_URL}/api/v1/usuario`, {
            headers: {
                Authorization: "Bearer " + token,
            },
        });
    return response.data;
}

export const getUsuarioById = async (id: number, token: string): Promise<Usuario> => {
    const response = await axios.get(`${API_URL}/api/v1/usuario/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

export const getPerfil = async (token: string): Promise<Usuario> => {
    const response = await axios.get(`${API_URL}/api/v1/usuario/perfil`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

export const getEventosUsuario = async (token: string): Promise<Evento[]> => {
    const response = await axios.get(`${API_URL}/api/v1/usuario/mis-eventos`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    );
    return response.data;
}