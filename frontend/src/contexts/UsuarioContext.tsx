import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../main.tsx";
import { getToken, isLoggedIn } from "../screens/Home.tsx";

interface Usuario {
    nombre: string;
    apellido: string;
    username: string;
    correo: string;
    rol: string;
}

const UsuarioContext = createContext<Usuario | null>(null);

export const useUsuario = () => useContext(UsuarioContext);

interface UsuarioProviderProps {
    children: React.ReactNode;
}

export const UsuarioProvider: React.FC<UsuarioProviderProps> = ({
    children,
}) => {
    const [usuario, setUsuario] = useState<Usuario | null>(null);

    useEffect(() => {
        if (!isLoggedIn()) {
            return;
        }
        axios
            .get(`${API_URL}/api/v1/usuario/perfil`, {
                headers: {
                    Authorization: "Bearer " + getToken(),
                },
            })
            .then((response) => {
                setUsuario(response.data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, []);

    return (
        <UsuarioContext.Provider value={usuario}>
            {children}
        </UsuarioContext.Provider>
    );
};

export default UsuarioContext;
