import axios from "axios";
import { API_URL } from "../main.tsx";
import { Usuario } from "../contexts/UsuarioContext";
import { Evento } from "../screens/Eventos.tsx";

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
