import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdPublic, MdLock } from "react-icons/md";

import Navbar from "../components/Navbar";
import { Evento } from "./Eventos";
import { getToken } from "./Home";
import { useUsuario } from "../contexts/UsuarioContext";
import { getEventos } from "../api/eventos";
import { getEventosUsuario } from "../api/usuarios";

const HistoricoEventos = () => {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const usuarioContext = useUsuario();

    useEffect(() => {
        const fetchEventos = async () => {
            setLoading(true);
            setError("");
            try {
                const token = getToken();
                const rol = usuarioContext?.usuario?.rol;

                if (rol === "ADMIN") {
                    setEventos(await getEventos());
                } else {
                    setEventos(await getEventosUsuario());
                }
            } catch (err) {
                console.error("Error fetching eventos:", err);
                setError("Error al obtener el historial de eventos.");
            } finally {
                setLoading(false);
            }
        };

        fetchEventos();
    }, [usuarioContext]);

    const calcularEstadoEvento = (evento: Evento) => {
        const ahora = new Date();
        const fechaEvento = parseFecha(evento.fecha);
        return fechaEvento < ahora ? "Pasado" : "Activo";
    };

    if (loading) {
        return (
            <div className={"main-container"}>
                <Navbar />
                <div className={"eventos"}>
                    <h4 style={{ textAlign: "center", color: "white" }}>
                        Cargando historial...
                    </h4>
                </div>
            </div>
        );
    }

    const parseFecha = (fechaStr: string) => {
        if (!fechaStr) return new Date(0);

        if (fechaStr.includes("T") || fechaStr.includes("/"))
            return new Date(fechaStr);

        const parts = fechaStr.split("-");
        if (parts.length === 3 && parts[2].length === 4) {
            return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        }

        if (parts.length === 3 && parts[0].length === 4) {
            return new Date(fechaStr);
        }
        return new Date(fechaStr);
    };

    return (
        <div className="main-container">
            <Navbar />
            <div className="eventos">
                <h1 style={{ color: "#fff" }}>Histórico de Eventos</h1>

                {loading && (
                    <p style={{ color: "#fff" }}>Cargando eventos...</p>
                )}

                {!loading && error ? (
                    <p style={{ color: "#ff5252" }}>{error}</p>
                ) : eventos.length === 0 ? (
                    <p style={{ color: "#fff" }}>
                        No hay eventos en el historial.
                    </p>
                ) : (
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {eventos
                            .sort(
                                (a, b) =>
                                    parseFecha(b.fecha).getTime() -
                                    parseFecha(a.fecha).getTime()
                            )
                            .map((evento) => {
                                const estado = calcularEstadoEvento(evento);
                                return (
                                    <li
                                        key={evento.id}
                                        style={{
                                            background: "#333",
                                            margin: "16px 0",
                                            borderRadius: "8px",
                                            padding: "18px",
                                            boxShadow:
                                                "0 2px 8px rgba(0,0,0,0.25)",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: "10px",
                                                }}
                                            >
                                                <Link
                                                    to={`/eventos/${evento.id}`}
                                                    style={{
                                                        color: "#2196f3",
                                                        textDecoration:
                                                            "underline",
                                                        fontWeight: "bold",
                                                        fontSize: "1.25em",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    {evento.nombre}
                                                </Link>
                                                {evento.publico ? (
                                                    <MdPublic
                                                        size={30}
                                                        color="white"
                                                    />
                                                ) : (
                                                    <MdLock
                                                        size={30}
                                                        color="white"
                                                    />
                                                )}
                                            </div>
                                            <span
                                                style={{
                                                    padding: "4px 14px",
                                                    borderRadius: "12px",
                                                    color: "#fff",
                                                    background:
                                                        estado === "Activo"
                                                            ? "#43e97b"
                                                            : "#e53935",
                                                    fontWeight: "bold",
                                                    fontSize: "1em",
                                                    marginLeft: "16px",
                                                }}
                                            >
                                                {estado}
                                            </span>
                                        </div>
                                        <p
                                            style={{
                                                margin: "10px 0 0 0",
                                                color: "#fff",
                                            }}
                                        >
                                            <b style={{ color: "#ffffff" }}>
                                                Tipo:
                                            </b>{" "}
                                            <span style={{ color: "#b3e5fc" }}>
                                                {evento.tipo}
                                            </span>
                                        </p>
                                        <p
                                            style={{
                                                margin: "4px 0",
                                                color: "#fff",
                                            }}
                                        >
                                            <b style={{ color: "#ffffff" }}>
                                                Fecha:
                                            </b>{" "}
                                            <span style={{ color: "#b3e5fc" }}>
                                                {evento.fecha}
                                            </span>
                                        </p>
                                        <p
                                            style={{
                                                margin: "4px 0",
                                                color: "#fff",
                                            }}
                                        >
                                            <b style={{ color: "#ffffff" }}>
                                                Organizador:
                                            </b>{" "}
                                            <span style={{ color: "#b3e5fc" }}>
                                                {evento.nombreOrganizador}
                                            </span>
                                        </p>
                                        <p
                                            style={{
                                                margin: "4px 0",
                                                color: "#fff",
                                            }}
                                        >
                                            <b style={{ color: "#ffffff" }}>
                                                Empresa Patrocinadora:
                                            </b>{" "}
                                            <span style={{ color: "#b3e5fc" }}>
                                                {evento.empresaPatrocinadora &&
                                                evento.empresaPatrocinadora
                                                    .nombre
                                                    ? evento
                                                          .empresaPatrocinadora
                                                          .nombre
                                                    : "Sin patrocinador"}
                                            </span>
                                        </p>
                                    </li>
                                );
                            })}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default HistoricoEventos;
