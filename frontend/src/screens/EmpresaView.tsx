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
    logoUrl?: string;
    eventos: EventoResumen[];
}

const EmpresaView = () => {
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
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
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <div>
                                    <b
                                        style={{
                                            color: "#fff",
                                            fontSize: "1.1em",
                                        }}
                                    >
                                        {empresa.nombre}
                                    </b>
                                    <div
                                        style={{
                                            color: "#b3e5fc",
                                            marginLeft: 16,
                                            marginTop: 8,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Eventos que patrocina:
                                    </div>
                                    <ul
                                        style={{
                                            margin: "4px 0 0 32px",
                                            color: "#b3e5fc",
                                        }}
                                    >
                                        {empresa.eventos &&
                                        empresa.eventos.length > 0 ? (
                                            empresa.eventos.map((evento) => (
                                                <li
                                                    key={evento.id}
                                                    style={{ marginBottom: 4 }}
                                                >
                                                    <button
                                                        className="btn btn-link"
                                                        style={{
                                                            color: "#b3e5fc",
                                                            textDecoration:
                                                                "underline",
                                                            padding: 0,
                                                            background: "none",
                                                            border: "none",
                                                            cursor: "pointer",
                                                            fontSize: "1em",
                                                        }}
                                                        onClick={() =>
                                                            navigate(
                                                                `/eventos/${evento.id}`
                                                            )
                                                        }
                                                    >
                                                        {evento.nombre}
                                                    </button>
                                                </li>
                                            ))
                                        ) : (
                                            <li style={{ color: "#aaa" }}>
                                                No patrocina eventos
                                            </li>
                                        )}
                                    </ul>
                                </div>
                                <button
                                    className="btn submit-button"
                                    onClick={() => setSelectedEmpresa(empresa)}
                                >
                                    Ver detalles
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                {/* Modal de detalles de empresa */}
                {selectedEmpresa && (
                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100vw",
                            height: "100vh",
                            background: "rgba(0,0,0,0.7)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 1000,
                        }}
                        onClick={() => setSelectedEmpresa(null)}
                    >
                        <div
                            style={{
                                background: "#222",
                                borderRadius: 12,
                                padding: 32,
                                minWidth: 320,
                                maxWidth: 600, // <-- más ancho
                                color: "#fff",
                                position: "relative",
                                boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                style={{
                                    position: "absolute",
                                    top: 12,
                                    right: 12,
                                    background: "none",
                                    border: "none",
                                    color: "#fff",
                                    fontSize: 24,
                                    cursor: "pointer",
                                }}
                                onClick={() => setSelectedEmpresa(null)}
                            >
                                ×
                            </button>
                            <h2 style={{ color: "#b3e5fc" }}>{selectedEmpresa.nombre}</h2>
                            <p style={{ margin: "16px 0" }}>{selectedEmpresa.descripcion}</p>
                            {selectedEmpresa.logoUrl && (
                                <img
                                    src={selectedEmpresa.logoUrl}
                                    alt={selectedEmpresa.nombre}
                                    style={{
                                        width: "100%",
                                        maxHeight: 300, // <-- más alto para mejor visualización
                                        objectFit: "contain",
                                        borderRadius: 8,
                                        background: "#fff",
                                        marginBottom: 12,
                                    }}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmpresaView;
