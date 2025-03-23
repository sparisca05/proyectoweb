import axios from "axios";
import { API_URL } from "../main.tsx";
import { Usuario } from "../contexts/UsuarioContext";

export const getEventParticipants = async (eventId: number): Promise<Usuario[]> => {
    const response = await axios.get(`${API_URL}/api/v1/eventos/${eventId}`);
    return response.data.participantes;
};
