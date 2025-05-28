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
import AddInvitadoInput from "../components/AddInvitadoInput.tsx";
import { ImageUpload } from "../components/ImageUpload.tsx";
import "../App.css";
import Confirmation from "../components/Confirmation.tsx";
import { addPublicEventParticipant, getEventoById } from "../api/eventos.ts";
import { getPerfil } from "../api/usuarios.ts";
import {
    useComentariosEvento,
    agregarComentarioEvento,
    ComentarioEvento,
} from "../api/comentarios";

function EventoView() {
    const token = getToken();
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingParticipacion, setLoadingParticipation] =
        useState<boolean>(false);
    const [usuario, setUsuario] = useState<Usuario | null>(null);

    const { id } = useParams<{ id: string }>();
    const [evento, setEvento] = useState<Evento>();
    const [userHasEvent, setUserHasEvent] = useState<boolean>(false);
    const [displayPasskey, setDisplayPasskey] = useState<boolean>(false);
    const [displayInvitado, setDisplayInvitado] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [showClave, setShowClave] = useState<boolean>(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [estadoEvento, setEstadoEvento] = useState<string>("");

    const {
        comentarios,
        loading: loadingComentarios,
        error: errorComentarios,
        setComentarios,
    } = useComentariosEvento(Number(id));
    const [nuevoComentario, setNuevoComentario] = useState("");
    const [comentarioLoading, setComentarioLoading] = useState(false);

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
        if (evento) {
            const estado = calcularEstadoEvento(evento);
            setEstadoEvento(estado);
        }
    }, [evento && usuario]);

    useEffect(() => {
        const fetchEvento = async () => {
            try {
                setLoading(true);
                const eventId = parseInt(id ?? "0", 10);
                const evento = await getEventoById(eventId);
                setEvento(evento);

                const usuario = await getPerfil();
                setUsuario(usuario);
            } catch (error) {
                console.error("Error fetching evento:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvento();
    }, [id, token]);

    const calcularEstadoEvento = (evento: Evento) => {
        const ahora = new Date();
        const fechaEvento = new Date(evento.fecha);
        return fechaEvento < ahora ? "Pasado" : "Activo";
    };

    const handleParticipar = async (eventId: number) => {
        if (!token) {
            alert("Debes iniciar sesión para inscribirte en un evento.");
            return;
        }
        try {
            if (!evento?.publico) {
                setDisplayPasskey(true);
                return;
            }
            setLoadingParticipation(true);
            const message = await addPublicEventParticipant(eventId);
            alert(message);
            window.location.reload();
        } catch (error) {
            console.error("Error al agregar participante:", error);
            alert("Error al agregar participante al evento.");
        } finally {
            setLoadingParticipation(false);
        }
    };

    const handleRemoveParticipationClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowConfirmation(true);
    };

    const handleConfirm = () => {
        handleRemoveParticipation();
        setShowConfirmation(false);
    };

    const handleCancel = () => {
        setShowConfirmation(false);
    };

    const handleRemoveParticipation = async () => {
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

    const handleSubmitComentario = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nuevoComentario.trim()) return;
        setComentarioLoading(true);
        try {
            const comentario = await agregarComentarioEvento(
                Number(id),
                nuevoComentario
            );
            setComentarios((prev: ComentarioEvento[]) => [comentario, ...prev]);
            setNuevoComentario("");
        } catch (e) {
            alert("No se pudo agregar el comentario");
        } finally {
            setComentarioLoading(false);
        }
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
            {showConfirmation && (
                <Confirmation
                    title="Dejar de participar"
                    message="¿Estás seguro de que deseas dejar de participar en este evento?"
                    confirmText="Dejar de participar"
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
            {loadingParticipacion && (
                <div className={"loading-container"}>
                    <h4>Procesando participación...</h4>
                </div>
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
                                                className="form-control"
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
                                                className="form-control"
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
                                                className="form-control"
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
                                                className="form-control"
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
                                                className="form-control"
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
                                            <ImageUpload
                                                onImageUpload={(url) =>
                                                    setEvento({
                                                        ...evento,
                                                        imagenUrl: url,
                                                    })
                                                }
                                                endpoint="evento-imagen"
                                            />
                                        </>
                                    ) : (
                                        <div className="row">
                                            <div className="col">
                                                <h5
                                                    style={{
                                                        color: "#0d6efd",
                                                        alignSelf: "center",
                                                    }}
                                                >
                                                    {evento.tipo}
                                                </h5>
                                                <h2
                                                    style={{
                                                        alignSelf: "center",
                                                    }}
                                                >
                                                    {evento.nombre}
                                                </h2>
                                                {usuario?.rol === "ADMIN" &&
                                                    !evento.publico && (
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
                                                    <strong>
                                                        {evento.fecha}
                                                    </strong>
                                                </p>
                                                <p className="list-item">
                                                    Organiza:{" "}
                                                    <strong>
                                                        {
                                                            evento.nombreOrganizador
                                                        }
                                                    </strong>
                                                </p>
                                                <p className="list-item">
                                                    Contacto:{" "}
                                                    <strong>
                                                        {
                                                            evento.contactoOrganizador
                                                        }
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
                                                {estadoEvento === "Pasado" ? (
                                                    <p className="list-item">
                                                        Estado:{" "}
                                                        <strong
                                                            style={{
                                                                color: "red",
                                                            }}
                                                        >
                                                            {estadoEvento}
                                                        </strong>
                                                    </p>
                                                ) : (
                                                    <>
                                                        <p className="list-item">
                                                            Estado:{" "}
                                                            <strong
                                                                style={{
                                                                    color: "green",
                                                                }}
                                                            >
                                                                {estadoEvento}
                                                            </strong>
                                                        </p>
                                                        {userHasEvent ? (
                                                            <button
                                                                className={
                                                                    "btn btn-danger"
                                                                }
                                                                onClick={
                                                                    handleRemoveParticipationClick
                                                                }
                                                            >
                                                                Dejar de
                                                                participar
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className={
                                                                    "btn submit-button"
                                                                }
                                                                onClick={() =>
                                                                    handleParticipar(
                                                                        evento.id
                                                                    )
                                                                }
                                                            >
                                                                Participar
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                            {evento.imagenUrl && (
                                                <div className="col">
                                                    <img
                                                        src={evento.imagenUrl}
                                                        alt={evento.nombre}
                                                        style={{
                                                            width: "100%",
                                                            maxWidth: "400px",
                                                            height: "auto",
                                                            borderRadius: "8px",
                                                            objectFit: "cover",
                                                            marginBottom:
                                                                "1rem",
                                                            alignSelf: "center",
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div>
                                        <h4>
                                            {evento.participantes.length}{" "}
                                            {evento.participantes.length === 1
                                                ? "Participante"
                                                : "Participantes"}
                                        </h4>
                                    </div>
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
                                    <div style={{ marginTop: 32 }}>
                                        <h3>Comentarios del evento</h3>
                                        {loadingComentarios ? (
                                            <p>Cargando comentarios...</p>
                                        ) : errorComentarios ? (
                                            <p style={{ color: "red" }}>
                                                {errorComentarios}
                                            </p>
                                        ) : (
                                            <ul
                                                style={{
                                                    maxHeight: 250,
                                                    overflowY: "auto",
                                                    background: "#222",
                                                    borderRadius: 8,
                                                    padding: 16,
                                                }}
                                            >
                                                {comentarios.length === 0 ? (
                                                    <li
                                                        style={{
                                                            color: "#aaa",
                                                        }}
                                                    >
                                                        No hay comentarios aún.
                                                    </li>
                                                ) : (
                                                    comentarios.map(
                                                        (comentario) => (
                                                            <li
                                                                key={
                                                                    comentario.id
                                                                }
                                                                style={{
                                                                    marginBottom: 12,
                                                                    borderBottom:
                                                                        "1px solid #333",
                                                                    paddingBottom: 8,
                                                                }}
                                                            >
                                                                <b
                                                                    style={{
                                                                        color: "#b3e5fc",
                                                                    }}
                                                                >
                                                                    {comentario.usuarioNombre ||
                                                                        "Anónimo"}
                                                                </b>
                                                                <span
                                                                    style={{
                                                                        color: "#bbb",
                                                                        marginLeft: 8,
                                                                        fontSize: 12,
                                                                    }}
                                                                >
                                                                    {new Date(
                                                                        comentario.fechaCreacion
                                                                    ).toLocaleString()}
                                                                </span>
                                                                <div
                                                                    style={{
                                                                        color: "#fff",
                                                                        marginTop: 4,
                                                                    }}
                                                                >
                                                                    {
                                                                        comentario.contenido
                                                                    }
                                                                </div>
                                                            </li>
                                                        )
                                                    )
                                                )}
                                            </ul>
                                        )}
                                        <form
                                            onSubmit={async (e) => {
                                                handleSubmitComentario(e);
                                            }}
                                            style={{
                                                marginTop: 16,
                                                display: "flex",
                                                gap: 8,
                                            }}
                                        >
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Escribe un comentario..."
                                                value={nuevoComentario}
                                                onChange={(e) =>
                                                    setNuevoComentario(
                                                        e.target.value
                                                    )
                                                }
                                                disabled={comentarioLoading}
                                                style={{
                                                    flex: 1,
                                                    color: "#fff",
                                                }}
                                            />
                                            <button
                                                className="btn submit-button"
                                                type="submit"
                                                disabled={comentarioLoading}
                                            >
                                                Comentar
                                            </button>
                                        </form>
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
