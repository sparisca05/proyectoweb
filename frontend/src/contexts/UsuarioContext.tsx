import { createContext, useContext, useState, useEffect } from "react";
import { isLoggedIn } from "../screens/Home.tsx";
import { getPerfil } from "../api/usuarios.ts";

export interface Usuario {
    id: number;
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
        const fetchUsuario = async () => {
            if (isLoggedIn()) {
                try {
                    const usuario = await getPerfil();
                    setUsuario(usuario);
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                    setUsuario(null);
                }
            } else {
                setUsuario(null);
            }
        };
        fetchUsuario();
    }, [window.location.pathname]);

    return (
        <UsuarioContext.Provider value={{ usuario, setUsuario }}>
            {children}
        </UsuarioContext.Provider>
    );
};

export default UsuarioContext;
