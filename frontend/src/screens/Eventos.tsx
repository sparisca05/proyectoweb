import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosAdd } from "react-icons/io";
import { FaTrash } from "react-icons/fa";
import { MdPublic, MdLock } from "react-icons/md";
import { IoSearch } from "react-icons/io5";

import Navbar from "../components/Navbar.tsx";
import { useUsuario } from "../contexts/UsuarioContext.tsx";
import { deleteEvento, getEventos, getEventosActivos } from "../api/eventos.ts";
import { FaCalendarDays } from "react-icons/fa6";
import Loading from "../components/Loading.tsx";
import Confirmation from "../components/Confirmation.tsx";

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
    const [error, setError] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState<boolean>(true);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [eventoIdToDelete, setEventoIdToDelete] = useState<number | null>(
        null
    );
    const [eventos, setEventos] = useState<Evento[]>([]);
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

    const handleDelete = async (id: number) => {
        await deleteEvento(id);
        setSuccessMessage("Evento eliminado correctamente.");
        setErrorMsg("");
        setEventos((prevEventos) =>
            prevEventos.filter((evento) => evento.id !== id)
        );
    };

    const handleDeleteClick = (eventoId: number) => {
        setEventoIdToDelete(eventoId);
        setShowConfirmation(true);
    };

    const confirmDelete = (id: number) => {
        handleDelete(id);
        setShowConfirmation(false);
    };

    const cancelDelete = () => {
        setShowConfirmation(false);
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
                    <Loading />
                </div>
            </div>
        );
    }

    return (
        <div className={"main-container"}>
            <Navbar />
            <div className={"eventos"}>
                <h1>Eventos</h1>
                {showConfirmation && (
                    <Confirmation
                        title="Eliminar Evento"
                        message="¿Estás seguro que deseas eliminar este evento?"
                        confirmText="Eliminar"
                        onConfirm={() => confirmDelete(eventoIdToDelete || 0)}
                        onCancel={cancelDelete}
                    />
                )}
                <div
                    className="search-container"
                    style={{
                        margin: "0 auto 32px auto",
                        display: "flex",
                        maxWidth: "1100px",
                        minWidth: "0",
                        width: "100%",
                        alignItems: "center",
                        gap: "18px",
                        flexWrap: "wrap",
                        background: "#23272f",
                        borderRadius: 12,
                        boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
                        padding: "22px 16px",
                        justifyContent: "center",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            flex: 2,
                            background: "#181c22",
                            borderRadius: 8,
                            padding: "10px 12px",
                            minWidth: 220,
                            width: "100%",
                            maxWidth: 500,
                        }}
                    >
                        <IoSearch size={22} style={{ color: "#b3e5fc" }} />
                        <input
                            type="text"
                            placeholder="Buscar eventos por nombre, tipo o organizador..."
                            value={searchTerm}
                            style={{
                                border: "none",
                                backgroundColor: "transparent",
                                color: "#fff",
                                fontSize: 17,
                                outline: "none",
                                width: "100%",
                                minWidth: 120,
                            }}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div
                        style={{
                            display: "flex",
                            gap: 14,
                            flex: 1,
                            minWidth: 220,
                            width: "100%",
                            maxWidth: 500,
                            justifyContent: "center",
                        }}
                    >
                        <select
                            value={tipoFilter}
                            onChange={(e) => setTipoFilter(e.target.value)}
                            style={{
                                padding: "12px 18px",
                                borderRadius: "8px",
                                border: "none",
                                fontSize: "16px",
                                minWidth: "120px",
                                background: "#181c22",
                                color: "#b3e5fc",
                                fontWeight: 500,
                                outline: "none",
                                width: "100%",
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
                                padding: "12px 18px",
                                borderRadius: "8px",
                                border: "none",
                                fontSize: "16px",
                                minWidth: "120px",
                                background: "#181c22",
                                color: "#b3e5fc",
                                fontWeight: 500,
                                outline: "none",
                                width: "100%",
                            }}
                        >
                            <option value="desc">Más recientes</option>
                            <option value="asc">Más antiguos</option>
                        </select>
                    </div>
                    {usuario && usuario.usuario?.rol === "ADMIN" && (
                        <button
                            type="button"
                            className="add-btn"
                            onClick={() => navigate("/eventos/nuevo-evento")}
                        >
                            <span className="add-btn__text">Nuevo evento</span>
                            <span className="add-btn__icon">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={24}
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    height={24}
                                    fill="none"
                                    className="svg"
                                >
                                    <line y2={19} y1={5} x2={12} x1={12} />
                                    <line y2={12} y1={12} x2={19} x1={5} />
                                </svg>
                            </span>
                        </button>
                    )}
                </div>
                {errorMsg ? (
                    <div className="alert alert-danger">{errorMsg}</div>
                ) : null}
                {successMessage ? (
                    <div className="alert alert-success">{successMessage}</div>
                ) : null}
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
                                                handleDeleteClick(evento.id);
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
