import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../main.tsx";
import { getToken, isLoggedIn } from "../screens/Home.tsx";

export interface Usuario {
    nombre: string;
    apellido: string;
    username: string;
    correo: string;
    rol: string;
}

interface UsuarioContextType {
    usuario: Usuario | null;
    setUsuario: React.Dispatch<React.SetStateAction<Usuario | null>>;
}

const UsuarioContext = createContext<UsuarioContextType | null>(null);

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
                console.log(response.data);
                setUsuario(response.data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, []);

    return (
        <UsuarioContext.Provider value={{usuario, setUsuario}}>
            {children}
        </UsuarioContext.Provider>
    );
};

export default UsuarioContext;
