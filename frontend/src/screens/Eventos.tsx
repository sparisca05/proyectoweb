import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { IoIosAdd } from "react-icons/io";
import { FaTrash } from "react-icons/fa";

import { API_URL } from "../main.tsx";
import Navbar from "../components/Navbar.tsx";
import { getToken } from "./Home.tsx";
import { useUsuario } from "../contexts/UsuarioContext.tsx";
import { getEventos, getEventosActivos } from "../api/eventos.ts";

export interface Evento {
    id: number;
    nombre: string;
    tipo: string;
    clave: string;
    nombreOrganizador: string;
    contactoOrganizador: string;
    fecha: string;
    invitados: any[];
    participantes: any[];
    empresaPatrocinadora: {
        id: number;
        nombre: string;
    };
}

const EventoList: React.FC = () => {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState("");
    const usuario = useUsuario();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                setLoading(true);

                const rol = usuario?.usuario?.rol;
                if (rol === "ADMIN") {
                    setEventos(await getEventos());
                } else {
                    setEventos(await getEventosActivos());
                }

                setError("");
            } catch (error) {
                console.error("Error fetching eventos:", error);
                setError("Error: " + error);
            } finally {
                setLoading(false);
            }
        };
        fetchEventos();
    }, [usuario]);

    const handleDelete = (id: number) => {
        if (
            window.confirm("¿Estás seguro de que deseas eliminar este evento?")
        ) {
            axios
                .delete(`${API_URL}/api/v1/eventos/${id}`, {
                    headers: {
                        Authorization: "Bearer " + getToken(),
                    },
                })
                .then(() => {
                    setEventos(eventos.filter((evento) => evento.id !== id));
                })
                .catch((error) => {
                    console.error("Error:", error);
                    setError("Error: " + error);
                });
        }
    };

    if (loading) {
        return (
            <div className={"main-container"}>
                <Navbar />
                <div className={"eventos"}>
                    <h4 style={{ textAlign: "center", color: "white" }}>
                        Cargando eventos...
                    </h4>
                </div>
            </div>
        );
    }

    const noEventosMessage = eventos.length === 0 && (
        <div style={{ textAlign: "center", color: "white" }}>
            No hay eventos disponibles.
        </div>
    );

    return (
        <div className={"main-container"}>
            <Navbar />
            <div className={"eventos"}>
                <h1>Eventos</h1>
                {error ? <div>{error}</div> : noEventosMessage}
                <div>
                    {eventos.map((evento) => (
                        <Link
                            to={`/eventos/${evento.id}`}
                            key={evento.id}
                            className="evento"
                        >
                            <h4>{evento.nombre}</h4>
                            <h5>{evento.tipo}</h5>
                            <div>
                                <p>Fecha: </p>
                                {evento.fecha}
                            </div>
                            {usuario && usuario.usuario?.rol === "ADMIN" && (
                                <FaTrash
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleDelete(evento.id);
                                    }}
                                    className="delete-icon"
                                    size={40}
                                />
                            )}
                        </Link>
                    ))}
                    {usuario && usuario.usuario?.rol === "ADMIN" && (
                        <div className="add evento">
                            <IoIosAdd
                                className="add-icon"
                                onClick={() =>
                                    navigate("/eventos/nuevo-evento")
                                }
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventoList;
