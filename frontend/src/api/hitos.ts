import axios from "axios";
import { API_URL } from "../main.tsx";
import { Hito } from "../screens/Hitos.tsx";
import { getToken } from "../screens/Home.tsx";

export interface HitoDTO {
    id: number;
    nombre: string;
    categoria: string;
}

export const getHitos = async (): Promise<Hito[]> => {
    const response = await axios.get(`${API_URL}/api/v1/hitos`);
    return response.data;
};

export const createHito = async (hito: Hito): Promise<Hito> => {
    const response = await axios.post(`${API_URL}/api/v1/hitos`, hito);
    return response.data;
};

export const updateHito = async (hito: HitoDTO): Promise<Hito> => {
    const response = await axios.put(`${API_URL}/api/v1/hitos/${hito.id}`, hito, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
    return response.data;
};

export const deleteHito = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/api/v1/hitos/${id}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
};