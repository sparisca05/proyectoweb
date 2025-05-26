import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar.tsx";
import { IoIosAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useUsuario } from "../contexts/UsuarioContext.tsx";
import { getHitos } from "../api/hitos.ts";

export interface Hito {
    id: number;
    nombre: string;
    categoria: string;
    eventoRelevante: {
        id: number;
        nombre: string;
    };
    ganadores: {
        id: number;
        username: string;
        nombre: string;
        apellido: string;
    }[];
}

const Hitos: React.FC = () => {
    const [hitos, setHitos] = useState<Hito[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState("");
    const usuario = useUsuario();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchHitos = async () => {
            try {
                setLoading(true);
                const hitos = await getHitos();
                setHitos(hitos);
                setError("");
            } catch (error) {
                console.error("Error fetching hitos:", error);
                setError("Error: " + error);
            } finally {
                setLoading(false);
            }
        };
        fetchHitos();
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
                        {hitos &&
                            hitos.map((hito) => (
                                <tr key={hito.id}>
                                    <td>{hito.nombre}</td>
                                    <td>{hito.categoria}</td>
                                    <td>{hito.eventoRelevante.nombre}</td>
                                    <td>
                                        {hito.ganadores.length > 0 ? (
                                            hito.ganadores.map((ganador) => (
                                                <div key={ganador.id}>
                                                    {ganador.nombre}{" "}
                                                    {ganador.apellido}
                                                </div>
                                            ))
                                        ) : (
                                            <div>No hay ganadores</div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
                {usuario && usuario.usuario?.rol === "ADMIN" && (
                    <div className="add">
                        <IoIosAdd
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
