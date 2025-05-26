import axios from "axios";
import { API_URL } from "../main.tsx";
import { Hito } from "../screens/Hitos.tsx";

export const getHitos = async (): Promise<Hito[]> => {
    const response = await axios.get(`${API_URL}/api/v1/hitos`);
    return response.data;
};