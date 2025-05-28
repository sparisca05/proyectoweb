import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar.tsx";
import { IoIosAdd } from "react-icons/io";
import { FaEdit, FaSave, FaTimes, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useUsuario } from "../contexts/UsuarioContext.tsx";
import { deleteHito, getHitos, updateHito } from "../api/hitos.ts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Confirmation from "../components/Confirmation.tsx";
import Loading from "../components/Loading.tsx";

export interface Hito {
    id: number;
    nombre: string;
    categoria: string;
    eventoRelevante: {
        id: number;
        nombre: string;
    };
    ganadores: {
        id: number;
        username: string;
        nombre: string;
        apellido: string;
    }[];
}

const Hitos: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [hitos, setHitos] = useState<Hito[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<{
        nombre: string;
        categoria: string;
    }>({
        nombre: "",
        categoria: "",
    });
    const usuario = useUsuario();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchHitos = async () => {
            try {
                setLoading(true);
                const hitos = await getHitos();
                setHitos(hitos);
                setError("");
            } catch (error) {
                console.error("Error fetching hitos:", error);
                setError("Error: " + error);
            } finally {
                setLoading(false);
            }
        };
        fetchHitos();
    }, [usuario]);

    // Generar PDF de todos los hitos
    const handleDescargarReporteHitos = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("Reporte de Hitos", 14, 18);
        doc.setFontSize(12);
        doc.text(`Generado el: ${new Date().toLocaleString()}`, 14, 26);

        // Tabla principal de hitos
        autoTable(doc, {
            head: [["Nombre", "Categoría", "Evento Relevante", "Ganadores"]],
            body: hitos.map((hito) => [
                hito.nombre,
                hito.categoria,
                hito.eventoRelevante?.nombre || "-",
                hito.ganadores.length > 0
                    ? hito.ganadores
                          .map(
                              (g) => `${g.nombre} ${g.apellido} (${g.username})`
                          )
                          .join(", ")
                    : "Sin ganadores",
            ]),
            startY: 32,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [33, 150, 243] },
        });

        let nextY = (doc as any).lastAutoTable?.finalY
            ? (doc as any).lastAutoTable.finalY + 10
            : 40;
        doc.setFontSize(14);
        doc.text("Detalle de Ganadores por Hito", 14, nextY);
        doc.setFontSize(11);
        nextY += 6;
        hitos.forEach((hito, idx) => {
            doc.text(
                `${idx + 1}. ${hito.nombre} (${hito.categoria})`,
                14,
                nextY
            );
            nextY += 6;
            if (hito.ganadores.length > 0) {
                autoTable(doc, {
                    head: [["Nombre", "Apellido", "Username"]],
                    body: hito.ganadores.map((g) => [
                        g.nombre,
                        g.apellido,
                        g.username,
                    ]),
                    startY: nextY,
                    styles: { fontSize: 9 },
                    headStyles: { fillColor: [76, 175, 80] },
                    margin: { left: 18 },
                });
                nextY = (doc as any).lastAutoTable?.finalY
                    ? (doc as any).lastAutoTable.finalY + 8
                    : nextY + 12;
            } else {
                doc.text("Sin ganadores", 22, nextY);
                nextY += 8;
            }
        });

        doc.save("reporte_hitos.pdf");
    };

    const handleEdit = (hito: Hito) => {
        setEditingId(hito.id);
        setEditForm({
            nombre: hito.nombre,
            categoria: hito.categoria,
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({
            nombre: "",
            categoria: "",
        });
    };

    const handleSaveEdit = async () => {
        if (editingId === null) return;

        try {
            const updatedHito = {
                id: editingId,
                nombre: editForm.nombre,
                categoria: editForm.categoria,
            };
            const response = await updateHito(updatedHito);
            setHitos((prevHitos) =>
                prevHitos.map((hito) =>
                    hito.id === editingId
                        ? {
                              ...hito,
                              nombre: response.nombre,
                              categoria: response.categoria,
                          }
                        : hito
                )
            );
            setSuccessMessage("Hito actualizado correctamente");
            setEditingId(null);
            setEditForm({
                nombre: "",
                categoria: "",
            });
        } catch (error) {
            console.error("Error updating hito:", error);
            setError("Error al actualizar el hito");
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteHito(id);
            setHitos((prevHitos) => prevHitos.filter((hito) => hito.id !== id));
            setSuccessMessage("Hito eliminado correctamente");
        } catch (error) {
            console.error("Error deleting hito:", error);
            setError("Error al eliminar el hito");
        }
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowConfirmation(true);
    };

    const confirmDelete = (id: number) => {
        handleDelete(id);
        setShowConfirmation(false);
    };

    const cancelDelete = () => {
        setShowConfirmation(false);
    };

    if (loading) {
        return (
            <div className={"main-container"}>
                <Navbar />
                <div className={"eventos"}>
                    <h1>Hitos</h1>
                    <Loading />
                </div>
            </div>
        );
    }

    return (
        <div className={"main-container"}>
            <Navbar />
            <div className={"eventos"}>
                <h1>Hitos</h1>
                <button
                    className="button"
                    onClick={handleDescargarReporteHitos}
                >
                    <div className="button-wrapper">
                        <div className="text">Descargar reporte</div>
                        <span className="icon">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                                role="img"
                                width="2em"
                                height="2em"
                                preserveAspectRatio="xMidYMid meet"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"
                                />
                            </svg>
                        </span>
                    </div>
                </button>
                {error ? (
                    <div className="alert alert-danger">{error}</div>
                ) : null}
                {successMessage ? (
                    <div className="alert alert-success">{successMessage}</div>
                ) : null}
                <div
                    className="table-responsive"
                    style={{
                        overflowX: "auto",
                        width: "100%",
                        border: "1px solid #dee2e6",
                        borderRadius: "0.375rem",
                    }}
                >
                    <table
                        className="custom-table"
                        style={{
                            width: "100%",
                            marginBottom: 0,
                        }}
                    >
                        {error && (
                            <div
                                style={{ textAlign: "center", color: "white" }}
                            >
                                {error}
                            </div>
                        )}
                        <thead>
                            <tr>
                                <th style={{ minWidth: "50px" }}>Nombre</th>
                                <th style={{ minWidth: "50px" }}>Categoría</th>
                                <th style={{ minWidth: "50px" }}>
                                    Evento Relevante
                                </th>
                                <th style={{ minWidth: "50px" }}>Ganador</th>
                                {usuario &&
                                    usuario.usuario?.rol === "ADMIN" && (
                                        <th>Acciones</th>
                                    )}
                            </tr>
                        </thead>
                        <tbody>
                            {hitos &&
                                hitos.map((hito) => (
                                    <>
                                        <tr key={hito.id}>
                                            <td>
                                                {editingId === hito.id ? (
                                                    <input
                                                        type="text"
                                                        value={editForm.nombre}
                                                        onChange={(e) =>
                                                            setEditForm({
                                                                ...editForm,
                                                                nombre: e.target
                                                                    .value,
                                                            })
                                                        }
                                                        className="form-control"
                                                    />
                                                ) : (
                                                    hito.nombre
                                                )}
                                            </td>
                                            <td>
                                                {editingId === hito.id ? (
                                                    <input
                                                        type="text"
                                                        value={
                                                            editForm.categoria
                                                        }
                                                        onChange={(e) =>
                                                            setEditForm({
                                                                ...editForm,
                                                                categoria:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        className="form-control"
                                                    />
                                                ) : (
                                                    hito.categoria
                                                )}
                                            </td>
                                            <td>
                                                {hito.eventoRelevante.nombre}
                                            </td>
                                            <td>
                                                {hito.ganadores.length > 0 ? (
                                                    hito.ganadores.map(
                                                        (ganador) => (
                                                            <div
                                                                key={ganador.id}
                                                            >
                                                                {ganador.nombre}{" "}
                                                                {
                                                                    ganador.apellido
                                                                }
                                                            </div>
                                                        )
                                                    )
                                                ) : (
                                                    <div>No hay ganadores</div>
                                                )}
                                            </td>
                                            {usuario &&
                                                usuario.usuario?.rol ===
                                                    "ADMIN" && (
                                                    <td>
                                                        {showConfirmation && (
                                                            <Confirmation
                                                                title="Eliminar Hito"
                                                                message="¿Estás seguro que deseas eliminar este hito?"
                                                                confirmText="Eliminar"
                                                                onConfirm={() =>
                                                                    confirmDelete(
                                                                        hito.id
                                                                    )
                                                                }
                                                                onCancel={
                                                                    cancelDelete
                                                                }
                                                            />
                                                        )}
                                                        {editingId ===
                                                        hito.id ? (
                                                            <div className="btn-group">
                                                                <button
                                                                    className="btn btn-sm btn-success"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        handleSaveEdit();
                                                                    }}
                                                                    title="Guardar cambios"
                                                                >
                                                                    <FaSave />
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm btn-secondary"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        handleCancelEdit();
                                                                    }}
                                                                    title="Cancelar"
                                                                >
                                                                    <FaTimes />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="btn-group">
                                                                <button
                                                                    className="btn btn-sm submit-button"
                                                                    onClick={() => {
                                                                        handleEdit(
                                                                            hito
                                                                        );
                                                                    }}
                                                                    title="Editar hito"
                                                                >
                                                                    <FaEdit />
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm btn-danger"
                                                                    onClick={
                                                                        handleDeleteClick
                                                                    }
                                                                    title="Eliminar hito"
                                                                >
                                                                    <FaTrash />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                )}
                                        </tr>
                                    </>
                                ))}
                        </tbody>
                    </table>
                </div>

                {usuario && usuario.usuario?.rol === "ADMIN" && (
                    <div className="add">
                        <IoIosAdd
                            className="add-icon"
                            onClick={() => navigate("/hitos/nuevo-hito")}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Hitos;
