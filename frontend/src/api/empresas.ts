import axios from "axios";
import { API_URL } from "../main.tsx";
import { Empresa } from "../screens/EmpresaView.tsx";
import { getToken } from "../screens/Home.tsx";

interface EmpresaDTO {
    id: number;
    nombre: string;
    descripcion: string;
    logoUrl?: string;
}

export const getEmpresas = async (): Promise<Empresa[]> => {
    const response = await axios.get(`${API_URL}/api/v1/empresas`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getToken(),
        },
    });
    return response.data;
};
export const getEmpresaById = async (id: number): Promise<Empresa> => {
    const response = await axios.get(`${API_URL}/api/v1/empresas/${id}`);
    return response.data;
};
export const createEmpresa = async (empresa: Empresa): Promise<Empresa> => {
    const response = await axios.post(`${API_URL}/api/v1/empresas`, empresa, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
    return response.data;
};
export const updateEmpresa = async (empresa: EmpresaDTO): Promise<void> => {
    await axios.put(`${API_URL}/api/v1/empresas/${empresa.id}`, empresa, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
};
export const deleteEmpresa = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/api/v1/empresas/${id}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
};