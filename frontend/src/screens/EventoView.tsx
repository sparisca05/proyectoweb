import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import Navbar from "../components/Navbar.tsx";
import { getToken } from "./Home.tsx";
import { API_URL } from "../main.tsx";
import { Usuario } from "../contexts/UsuarioContext.tsx";
import PasskeyInput from "../components/PasskeyInput.tsx";
import { Evento } from "./Eventos.tsx";
import { Hito } from "./Hitos.tsx";
import AddInvitadoInput from "../components/AddInvitadoInput.tsx";
import "../App.css";

function EventoView() {
    const token = getToken();
    const { id } = useParams<{ id: string }>();
    const [evento, setEvento] = useState<Evento>(); // Estado para almacenar la lista de eventos
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [userHasEvent, setUserHasEvent] = useState<boolean>(false); // Estado para verificar si el usuario tiene el evento
    const [loading, setLoading] = useState<boolean>(true); // Estado para mostrar una carga
    const [displayPasskey, setDisplayPasskey] = useState<boolean>(false);
    const [displayInvitado, setDisplayInvitado] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [showClave, setShowClave] = useState<boolean>(false); // Nuevo estado para mostrar/ocultar la clave

    const navigate = useNavigate();

    useEffect(() => {
        let userParticipated = false;
        if (evento) {
            userParticipated = evento.participantes.some(
                (participante: { id: number | undefined }) =>
                    participante.id === usuario?.id
            );
            setUserHasEvent(userParticipated);
        }
    }, [evento && usuario]);

    useEffect(() => {
        axios
            .get(`${API_URL}/api/v1/usuario/perfil`, {
                headers: {
                    Authorization: "Bearer " + token,
                },
            })
            .then((response) => {
                setUsuario(response.data);
            })
            .catch((error) => {
                console.error("Error: ", error);
            });
        axios
            .get(`${API_URL}/api/v1/eventos/${id}`)
            .then((response) => {
                setEvento(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error:", error);
                setLoading(false);
            });
    }, [id, token]);

    const handleRemoveParticipacion = async () => {
        await axios
            .delete(`${API_URL}/api/v1/eventos/${id}/eliminar-participante`, {
                headers: {
                    Authorization: "Bearer " + token,
                },
                params: {
                    username: usuario?.username,
                },
            })
            .then((response) => response.data)
            .then((message) => {
                alert(message);
                window.location.reload();
            })
            .catch((error) => {
                alert("Error al eliminar la participación del evento.");
                console.error("Error:", error);
            });
    };

    const handleRemoveInvitado = async (invitadoId: number) => {
        await axios
            .delete(`${API_URL}/api/v1/eventos/${id}/eliminar-invitado`, {
                headers: {
                    Authorization: "Bearer " + token,
                },
                params: {
                    invitadoId: invitadoId,
                },
            })
            .then((response) => response.data)
            .then((message) => {
                alert(message);
                window.location.reload();
            })
            .catch((error) => {
                alert("Error al eliminar el invitado.");
                console.error("Error:", error);
            });
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        await fetch(`${API_URL}/api/v1/eventos/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify(evento),
        }).then((response) => {
            if (response.ok) {
                alert("Evento actualizado");
                setIsEditing(false);
            } else {
                alert("Error al actualizar el evento");
            }
        });
    };

    return (
        <div className={"main-container"}>
            {displayPasskey && (
                <PasskeyInput
                    evento={evento}
                    setDisplayPasskey={setDisplayPasskey}
                />
            )}
            {displayInvitado && (
                <AddInvitadoInput
                    evento={evento}
                    setDisplayInvitado={setDisplayInvitado}
                />
            )}
            <Navbar />
            <div className={"welcome"}>
                <div className={"auth-container"}>
                    <div
                        style={{
                            display: "flex",
                            width: "100%",
                            justifyContent: "space-between",
                        }}
                    >
                        {isEditing ? (
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancelar
                            </button>
                        ) : (
                            <IoMdClose
                                className="back-btn"
                                onClick={() => navigate("/eventos")}
                            />
                        )}
                        {usuario?.rol === "ADMIN" && evento && (
                            <>
                                {!isEditing ? (
                                    <button
                                        className="btn submit-button outline"
                                        onClick={handleEditClick}
                                    >
                                        Editar
                                    </button>
                                ) : (
                                    <button
                                        className={"btn btn-success"}
                                        onClick={handleSaveClick}
                                    >
                                        Guardar
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                    {loading ? (
                        <h4>Cargando evento...</h4>
                    ) : (
                        <>
                            {!evento ? (
                                <div>Evento no encontrado</div>
                            ) : (
                                <>
                                    {isEditing ? (
                                        <>
                                            <input
                                                type="text"
                                                value={evento.nombre}
                                                onChange={(e) =>
                                                    setEvento({
                                                        ...evento,
                                                        nombre: e.target.value,
                                                    })
                                                }
                                            />
                                            <input
                                                type="text"
                                                value={evento.tipo}
                                                onChange={(e) =>
                                                    setEvento({
                                                        ...evento,
                                                        tipo: e.target.value,
                                                    })
                                                }
                                            />
                                            <input
                                                type="date"
                                                value={evento.fecha}
                                                onChange={(e) =>
                                                    setEvento({
                                                        ...evento,
                                                        fecha: e.target.value,
                                                    })
                                                }
                                            />
                                            <input
                                                type="text"
                                                value={evento.nombreOrganizador}
                                                onChange={(e) =>
                                                    setEvento({
                                                        ...evento,
                                                        nombreOrganizador:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                            <input
                                                type="text"
                                                value={
                                                    evento.contactoOrganizador
                                                }
                                                onChange={(e) =>
                                                    setEvento({
                                                        ...evento,
                                                        contactoOrganizador:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <h2 style={{ alignSelf: "center" }}>
                                                {evento.nombre}
                                            </h2>
                                            <h5
                                                style={{
                                                    color: "#0d6efd",
                                                    alignSelf: "center",
                                                }}
                                            >
                                                {evento.tipo}
                                            </h5>
                                            {usuario?.rol === "ADMIN" && (
                                                <p className="list-item">
                                                    Clave de acceso:{" "}
                                                    <strong>
                                                        {showClave
                                                            ? evento.clave
                                                            : "●●●●●●●●"}
                                                        <button
                                                            onClick={() =>
                                                                setShowClave(
                                                                    !showClave
                                                                )
                                                            }
                                                            style={{
                                                                background:
                                                                    "none",
                                                                border: "none",
                                                                cursor: "pointer",
                                                                padding: 0,
                                                                marginLeft:
                                                                    "0.5rem",
                                                            }}
                                                        >
                                                            {showClave ? (
                                                                <FaEyeSlash color="white" />
                                                            ) : (
                                                                <FaEye color="white" />
                                                            )}
                                                        </button>
                                                    </strong>
                                                </p>
                                            )}
                                            <p className="list-item">
                                                Fecha:{" "}
                                                <strong>{evento.fecha}</strong>
                                            </p>
                                            <p className="list-item">
                                                Organiza:{" "}
                                                <strong>
                                                    {evento.nombreOrganizador}
                                                </strong>
                                            </p>
                                            <p className="list-item">
                                                Contacto:{" "}
                                                <strong>
                                                    {evento.contactoOrganizador}
                                                </strong>
                                            </p>
                                            <p className="list-item">
                                                Patrocina:{" "}
                                                <strong>
                                                    {
                                                        evento
                                                            .empresaPatrocinadora
                                                            .nombre
                                                    }
                                                </strong>
                                            </p>
                                        </>
                                    )}
                                    <div>
                                        <h4>
                                            {evento.participantes.length}{" "}
                                            {evento.participantes.length === 1
                                                ? "Participante"
                                                : "Participantes"}
                                        </h4>
                                    </div>
                                    {userHasEvent ? (
                                        <button
                                            className={"btn btn-danger"}
                                            onClick={() =>
                                                handleRemoveParticipacion()
                                            }
                                        >
                                            Dejar de participar
                                        </button>
                                    ) : (
                                        <button
                                            className={"btn submit-button"}
                                            onClick={() =>
                                                setDisplayPasskey(true)
                                            }
                                        >
                                            Participar
                                        </button>
                                    )}
                                    <div>
                                        <h4>Invitados externos</h4>
                                        <ul
                                            className={
                                                "list-group list-group-flush"
                                            }
                                            style={{
                                                backgroundColor: "transparent",
                                            }}
                                        >
                                            {evento.invitados.length === 0 ? (
                                                <li
                                                    className={
                                                        "list-group-item d-flex justify-content-between align-items-center"
                                                    }
                                                    style={{
                                                        backgroundColor:
                                                            "transparent",
                                                    }}
                                                >
                                                    No hay invitados externos
                                                </li>
                                            ) : (
                                                <>
                                                    {evento.invitados.map(
                                                        (invitado, index) => (
                                                            <li
                                                                className={
                                                                    "list-group-item d-flex justify-content-between align-items-center"
                                                                }
                                                                style={{
                                                                    backgroundColor:
                                                                        "transparent",
                                                                }}
                                                                key={index}
                                                            >
                                                                {
                                                                    invitado.nombre
                                                                }{" "}
                                                                {
                                                                    invitado.apellido
                                                                }
                                                                {" - "}
                                                                {
                                                                    invitado.descripcionRol
                                                                }
                                                                {usuario?.rol ===
                                                                    "ADMIN" && (
                                                                    <button
                                                                        onClick={() =>
                                                                            handleRemoveInvitado(
                                                                                invitado.id
                                                                            )
                                                                        }
                                                                        style={{
                                                                            color: "red",
                                                                        }}
                                                                    >
                                                                        <FaTrash />
                                                                    </button>
                                                                )}
                                                            </li>
                                                        )
                                                    )}
                                                </>
                                            )}
                                        </ul>
                                        {usuario?.rol === "ADMIN" && (
                                            <button
                                                className="btn btn-link"
                                                onClick={() =>
                                                    setDisplayInvitado(true)
                                                }
                                            >
                                                + Anadir
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EventoView;
