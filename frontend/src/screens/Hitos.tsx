import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../main.tsx";
import Navbar from "../components/Navbar.tsx";



interface Hito {
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
    

    useEffect(() => {
        axios
            .get(`${API_URL}/api/v1/hitos`)
            .then((response) => {
                console.log("Datos de hitos:", response.data);
                if (response.data && response.data.length > 0) {
                    setHitos(response.data);
                } else {
                    setError("No hay hitos disponibles.");
                }
            })
            .catch((error) => {
                console.error("Error al obtener hitos:", error);
                
            })
            .finally(() => setLoading(false));
    }, []);


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
                {error ? <div>{error}</div> : null}
                <table className="custom-table">
                    <thead >
                        <tr>
                            
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Evento Relevante</th>
                            <th>Ganadores</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hitos.map((hito) => (
                            <tr key={hito.id}>
                                <td>{hito.nombre}</td>
                                <td>{hito.categoria}</td>
                                <td>{hito.eventoRelevante?.nombre || "N/A"}</td>
                                <td>{hito.ganadores.length > 0 ? hito.ganadores.join(", ") : "Sin ganadores"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Hitos;
