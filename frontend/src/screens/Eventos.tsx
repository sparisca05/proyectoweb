import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";

import { API_URL } from "../main.tsx";
import Navbar from "../components/Navbar.tsx";
import { getToken } from "./Home.tsx";
import { FaTrash } from "react-icons/fa";

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
    empresaPatrocinadora: any;
}
export interface UsuarioRol {
    rol: string;
}

const EventoList: React.FC = () => {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [usuario, setUsuario] = useState<UsuarioRol | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    // Efecto que hace la petición cuando el componente se monta
    useEffect(() => {
        axios
            .get(`${API_URL}/api/v1/eventos`)
            .then((response) => {
                setEventos(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setError("Error: " + err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (!getToken()) {
            return;
        }
        axios
            .get(`${API_URL}/api/v1/usuario/perfil`, {
                headers: {
                    Authorization: "Bearer " + getToken(),
                },
            })
            .then((response) => {
                setUsuario(response.data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, []);

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
            <div className={"evento-container"}>
                <Navbar />
                <div className={"eventos"}>
                    <h4>Cargando eventos...</h4>
                </div>
            </div>
        );
    }

    const noEventosMessage = eventos.length === 0 && (
        <div>No hay eventos disponibles.</div>
    );

    return (
        <div className={"evento-container"}>
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
                            {usuario && usuario.rol === "ADMIN" && (
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
                    {usuario && usuario.rol === "ADMIN" && (
                        <div className="add evento">
                            <IoIosAddCircleOutline
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
