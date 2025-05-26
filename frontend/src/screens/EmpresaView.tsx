import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { API_URL } from "../main";
import { getToken } from "./Home";

interface EventoResumen {
    id: number;
    nombre: string;
}

interface Empresa {
    id: number;
    nombre: string;
    descripcion: string;
    eventos: EventoResumen[];
}

const EmpresaView = () => {
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmpresas = async () => {
            try {
                const response = await fetch(`${API_URL}/api/v1/empresas`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + getToken(),
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setEmpresas(data);
                } else {
                    setError("Error al cargar las empresas.");
                }
            } catch (err) {
                setError("Error de conexión.");
            } finally {
                setLoading(false);
            }
        };
        fetchEmpresas();
    }, []);

    if (loading) {
        return (
            <div className="main-container">
                <Navbar />
                <div className="eventos">
                    <h4 style={{ color: "#fff" }}>Cargando empresas...</h4>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="main-container">
                <Navbar />
                <div className="eventos">
                    <h4 style={{ color: "#ff5252" }}>{error}</h4>
                </div>
            </div>
        );
    }

    return (
        <div className="main-container">
            <Navbar />
            <div className="eventos">
                <h1 style={{ color: "#fff" }}>Empresas Patrocinadoras</h1>
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {empresas.map((empresa) => (
                        <li
                            key={empresa.id}
                            style={{
                                background: "#333",
                                margin: "16px 0",
                                borderRadius: "8px",
                                padding: "18px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <b style={{ color: "#fff", fontSize: "1.1em" }}>{empresa.nombre}</b>
                                    <div style={{ color: "#b3e5fc", marginLeft: 16, marginTop: 8, fontWeight: "bold" }}>
                                        Eventos que patrocina:
                                    </div>
                                    <ul style={{ margin: "4px 0 0 32px", color: "#b3e5fc" }}>
                                        {empresa.eventos && empresa.eventos.length > 0 ? (
                                            empresa.eventos.map((evento) => (
                                                <li key={evento.id}>{evento.nombre}</li>
                                            ))
                                        ) : (
                                            <li style={{ color: "#aaa" }}>No patrocina eventos</li>
                                        )}
                                    </ul>
                                </div>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => navigate(`/empresas/${empresa.id}`)}
                                >
                                    Ver detalles
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default EmpresaView;