import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../main.tsx";
import Navbar from "../components/Navbar.tsx";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useUsuario } from "../contexts/UsuarioContext.tsx";

export interface Hito {
    id: number;
    nombre: string;
    categoria: string;
    eventoRelevante: { nombre: string };
    ganadores: string[];
}

const Hitos: React.FC = () => {
    const [hitos, setHitos] = useState<Hito[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState("");
    const usuario = useUsuario();

    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`${API_URL}/api/v1/hitos`)
            .then((response) => {
                if (response.data && response.data.length > 0) {
                    setHitos(response.data);
                } else {
                    setError("No se han asignado hitos aún.");
                }
            })
            .catch((error) => {
                console.error("Error al obtener hitos:", error);
            })
            .finally(() => setLoading(false));
    }, [usuario]);

    if (loading) {
        return (
            <div className={"main-container"}>
                <Navbar />
                <div className={"eventos"}>
                    <h4 style={{ textAlign: "center", color: "white" }}>
                        Cargando hitos...
                    </h4>
                </div>
            </div>
        );
    }

    return (
        <div className={"main-container"}>
            <Navbar />
            <div className={"eventos"}>
                <h1>Hitos</h1>
                <table className="custom-table">
                    {error && (
                        <div style={{ textAlign: "center", color: "white" }}>
                            {error}
                        </div>
                    )}
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Evento Relevante</th>
                            <th>Ganador</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hitos.map((hito) => (
                            <tr key={hito.id}>
                                <td>{hito.nombre}</td>
                                <td>{hito.categoria}</td>
                                <td>{hito.eventoRelevante?.nombre || "N/A"}</td>
                                <td>
                                    {hito.ganadores.length > 0
                                        ? hito.ganadores.join(", ")
                                        : "Sin ganadores"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {usuario && usuario.usuario?.rol === "ADMIN" && (
                    <div className="add">
                        <IoIosAddCircleOutline
                            className="add-icon"
                            onClick={() => navigate("/hitos/nuevo-hito")}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Hitos;
