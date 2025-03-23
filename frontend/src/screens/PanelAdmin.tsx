import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../main.tsx";
import Navbar from "../components/Navbar.tsx";
import { useUsuario } from "../contexts/UsuarioContext.tsx";
import { useNavigate } from "react-router-dom";
import { getToken } from "./Home.tsx";

interface Usuario {
    id: number;
    username: string;
    correo: string;
    nombre:string;
    apellido:string;
    rol: string;
}

const AdminPanel: React.FC = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState("");
    const usuario = useUsuario();
    const navigate = useNavigate();
    

    useEffect(() => {
        const token = getToken();
        if (!usuario || usuario.usuario?.rol !== "ADMIN") {
            navigate("/"); 
            return;
        }

        axios
            .get(`${API_URL}/api/v1/usuario`, {headers:{
                Authorization:"Bearer "+ token
            }
            })
            .then((response) => {
                setUsuarios(response.data);
            })
            .catch((error) => {
                console.error("Error al obtener usuarios:", error);
                setError("No se pudieron cargar los usuarios.");
            })
            .finally(() => setLoading(false));
    }, [usuario, navigate]);

    if (loading) {
        return (
            <div className="main-container">
                <Navbar />
                <h4 style={{ textAlign: "center", color: "white" }}>Cargando usuarios...</h4>
            </div>
        );
    }

    return (
        <div className="main-container">
            <Navbar />
            <div className="eventos">
                <h1>Panel de Usuarios</h1>
                {error ? <div>{error}</div> : null}
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>nombre</th>
                            <th>apellido</th>
                            <th>Usuario</th>
                            <th>Email</th>
                            <th>Rol</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((user) => (
                            <tr key={user.id}>
                                <td>{user.nombre}</td>
                                <td>{user.apellido}</td>
                                <td>{user.username}</td>
                                <td>{user.correo}</td>
                                <td>{user.rol}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPanel;
