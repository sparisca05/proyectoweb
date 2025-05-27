import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { IoIosAdd } from "react-icons/io";
import { FaTrash } from "react-icons/fa";
import { MdPublic, MdLock } from "react-icons/md";
import { IoSearch } from "react-icons/io5";

import { API_URL } from "../main.tsx";
import Navbar from "../components/Navbar.tsx";
import { getToken } from "./Home.tsx";
import { useUsuario } from "../contexts/UsuarioContext.tsx";
import { getEventos, getEventosActivos } from "../api/eventos.ts";
import { FaCalendarDays } from "react-icons/fa6";

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
    imagenUrl?: string;
    publico: boolean;
}

const EventoList: React.FC = () => {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [tipoFilter, setTipoFilter] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<string>("desc");
    const usuario = useUsuario();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                setLoading(true);

                if (!usuario?.usuario) {
                    setEventos(await getEventosActivos());
                } else {
                    const rol = usuario?.usuario?.rol;
                    if (rol === "ADMIN") {
                        setEventos(await getEventos());
                    } else if (rol === "PARTICIPANTE") {
                        setEventos(await getEventosActivos());
                    } else {
                        setEventos([]);
                    }
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

    const filteredEventos = eventos
        .filter((evento) => {
            const matchesSearch =
                evento.nombre
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                evento.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                evento.nombreOrganizador
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const matchesType = tipoFilter === "" || evento.tipo === tipoFilter;

            return matchesSearch && matchesType;
        })
        .sort((a, b) => {
            const dateA = new Date(
                a.fecha.split(" ")[0].split("-").reverse().join("-")
            );
            const dateB = new Date(
                b.fecha.split(" ")[0].split("-").reverse().join("-")
            );

            if (sortOrder === "asc") {
                return dateA.getTime() - dateB.getTime();
            } else {
                return dateB.getTime() - dateA.getTime();
            }
        });

    // Get unique event types for filter dropdown
    const uniqueTypes = [...new Set(eventos.map((evento) => evento.tipo))];

    const noEventosMessage = filteredEventos.length === 0 &&
        eventos.length > 0 &&
        searchTerm && (
            <div style={{ textAlign: "center", color: "white" }}>
                No se encontraron eventos que coincidan con la búsqueda.
            </div>
        );

    const noEventosAtAll = eventos.length === 0 && (
        <div style={{ textAlign: "center", color: "white" }}>
            No hay eventos disponibles.
        </div>
    );

    if (loading) {
        return (
            <div className={"main-container"}>
                <Navbar />
                <div className={"eventos"}>
                    <h1>Eventos</h1>
                    <div>
                        <h4 style={{ textAlign: "center", color: "white" }}>
                            Cargando eventos...
                        </h4>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={"main-container"}>
            <Navbar />
            <div className={"eventos"}>
                <h1>Eventos</h1>
                <div
                    className="search-container"
                    style={{
                        marginBottom: "20px",
                        display: "flex",
                        maxWidth: "800px",
                        alignItems: "center",
                        gap: "10px",
                        flexWrap: "wrap",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            flex: 1,
                        }}
                    >
                        <IoSearch size={20} style={{ color: "white" }} />
                        <input
                            type="text"
                            placeholder="Buscar eventos por nombre, tipo o organizador..."
                            value={searchTerm}
                            style={{
                                border: "none",
                                backgroundColor: "transparent",
                            }}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        value={tipoFilter}
                        onChange={(e) => setTipoFilter(e.target.value)}
                        style={{
                            padding: "10px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                            fontSize: "16px",
                            minWidth: "150px",
                        }}
                    >
                        <option value="">Todos los tipos</option>
                        {uniqueTypes.map((tipo) => (
                            <option key={tipo} value={tipo}>
                                {tipo}
                            </option>
                        ))}
                    </select>
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        style={{
                            padding: "10px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                            fontSize: "16px",
                            minWidth: "150px",
                        }}
                    >
                        <option value="desc">Más recientes</option>
                        <option value="asc">Más antiguos</option>
                    </select>
                </div>
                {error ? (
                    <div>{error}</div>
                ) : (
                    noEventosMessage || noEventosAtAll
                )}
                <div>
                    {filteredEventos &&
                        filteredEventos.map((evento) => (
                            <Link
                                to={`/eventos/${evento.id}`}
                                key={evento.id}
                                className="evento"
                            >
                                {evento.publico ? (
                                    <MdPublic
                                        className="visibility-icon"
                                        size={30}
                                    />
                                ) : (
                                    <MdLock
                                        className="visibility-icon"
                                        size={30}
                                    />
                                )}
                                <h5>{evento.tipo}</h5>
                                <h4>{evento.nombre}</h4>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "5px",
                                    }}
                                >
                                    <FaCalendarDays />
                                    <strong>Fecha: </strong>
                                    {evento.fecha}
                                </div>
                                {usuario &&
                                    usuario.usuario?.rol === "ADMIN" && (
                                        <FaTrash
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleDelete(evento.id);
                                            }}
                                            className="delete-icon"
                                            size={40}
                                        />
                                    )}
                                {evento.imagenUrl && (
                                    <img
                                        src={evento.imagenUrl}
                                        alt={evento.nombre}
                                        style={{
                                            height: "200px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                            marginBottom: "10px",
                                        }}
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
