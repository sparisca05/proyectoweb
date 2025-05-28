import axios from "axios";
import { API_URL } from "../main.tsx";
import { Usuario } from "../contexts/UsuarioContext";
import { Evento } from "../screens/Eventos.tsx";
import { getToken } from "../screens/Home.tsx";

export const getEventos = async (): Promise<Evento[]> => {
    const response = await axios.get(`${API_URL}/api/v1/eventos`);
    return response.data;
};

export const getEventoById = async (id: number): Promise<Evento> => {
    const response = await axios.get(`${API_URL}/api/v1/eventos/${id}`);
    return response.data;
}

export const getEventosActivos = async (): Promise<Evento[]> => {
    const response = await axios.get(`${API_URL}/api/v1/eventos/activos`);
    return response.data;
}

export const getEventParticipants = async (eventId: number): Promise<Usuario[]> => {
    const response = await axios.get(`${API_URL}/api/v1/eventos/${eventId}`);
    return response.data.participantes;
};

export const addPublicEventParticipant = async (eventId: number): Promise<string> => {
    const response = await axios.put(`${API_URL}/api/v1/eventos/${eventId}/agregar-participante-publico`,
        {},
        {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        }
    );
    return response.data;
}

export const addPrivateEventParticipant = async (eventId: number, clave: string): Promise<void> => {
    const response = await axios.put(`${API_URL}/api/v1/eventos/${eventId}/agregar-participante-privado`,
        clave,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
                'Content-Type': 'text/plain'
            }
        }
    );
    return response.data;
}

export const createEvento = async (evento: Evento): Promise<Evento> => {
    const response = await axios.post(`${API_URL}/api/v1/eventos`, evento, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
    return response.data;
};

export const updateEvento = async (evento: Evento): Promise<Evento> => {
    const response = await axios.put(`${API_URL}/api/v1/eventos/${evento.id}`, evento, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
    return response.data;
};

export const deleteEvento = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/api/v1/eventos/${id}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
};
