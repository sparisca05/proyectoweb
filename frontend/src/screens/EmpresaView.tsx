import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useUsuario } from "../contexts/UsuarioContext";
import { ImageUpload } from "../components/ImageUpload";
import Loading from "../components/Loading";
import { deleteEmpresa, getEmpresas, updateEmpresa } from "../api/empresas";
import Confirmation from "../components/Confirmation";

interface EventoResumen {
    id: number;
    nombre: string;
}

export interface Empresa {
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
    const [successMessage, setSuccessMessage] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(
        null
    );
    const [editEmpresa, setEditEmpresa] = useState<Empresa | null>(null);
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState("");
    const [deletingEmpresaId, setDeletingEmpresaId] = useState<number | null>(
        null
    );

    const navigate = useNavigate();
    const usuario = useUsuario();

    useEffect(() => {
        const fetchEmpresas = async () => {
            try {
                const empresas = await getEmpresas();
                setEmpresas(empresas);
            } catch (err) {
                setError("Error al cargar las empresas.");
                setTimeout(() => setError(""), 3000);
            } finally {
                setLoading(false);
            }
        };
        fetchEmpresas();
    }, []);

    const handleEditarEmpresa = (empresa: Empresa) => {
        console.log("Editando empresa:", empresa);
        setEditEmpresa(empresa);
    };

    const handleDeleteEmpresa = async (empresaId: number) => {
        try {
            await deleteEmpresa(empresaId);
            setEmpresas(empresas.filter((e) => e.id !== empresaId));
            setSuccessMessage("Empresa eliminada correctamente.");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (e) {
            console.error("Error al eliminar la empresa:", e);
            setError("Error al eliminar la empresa.");
            setTimeout(() => setError(""), 3000);
        }
    };

    const handleDeleteClick = (empresaId: number) => {
        setDeletingEmpresaId(empresaId);
        setShowConfirmation(true);
    };

    const confirmDelete = (id: number) => {
        handleDeleteEmpresa(id);
        setShowConfirmation(false);
    };
    const cancelDelete = () => {
        setShowConfirmation(false);
    };

    // Guardar cambios de empresa
    const handleGuardarEdicion = async () => {
        if (!editEmpresa) return;
        setEditLoading(true);
        setEditError("");
        try {
            const requestBody = {
                id: editEmpresa.id,
                nombre: editEmpresa.nombre,
                descripcion: editEmpresa.descripcion,
                logoUrl: editEmpresa.logoUrl,
            };
            await updateEmpresa(requestBody);
            // Actualizar la lista de empresas con la empresa editada
            window.location.reload();
        } catch (e) {
            setEditError("Error de conexión");
        } finally {
            setEditLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="main-container">
                <Navbar />
                <div className="eventos">
                    <h1>Empresas Patrocinadoras</h1>
                    <Loading />
                </div>
            </div>
        );
    }

    return (
        <div className="main-container">
            <Navbar />
            <div className="eventos">
                <h1>Empresas Patrocinadoras</h1>
                {error ? (
                    <div className="alert alert-danger">{error}</div>
                ) : null}
                {successMessage ? (
                    <div className="alert alert-success">{successMessage}</div>
                ) : null}
                {showConfirmation && (
                    <Confirmation
                        title="Eliminar Hito"
                        message="¿Estás seguro que deseas eliminar este hito?"
                        confirmText="Eliminar"
                        onConfirm={() => confirmDelete(deletingEmpresaId!)}
                        onCancel={cancelDelete}
                    />
                )}
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
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 8,
                                    }}
                                >
                                    <button
                                        className="btn submit-button"
                                        onClick={() =>
                                            setSelectedEmpresa(empresa)
                                        }
                                    >
                                        Ver detalles
                                    </button>
                                    {usuario?.usuario?.rol === "ADMIN" && (
                                        <div
                                            style={{ display: "flex", gap: 8 }}
                                        >
                                            <button
                                                className="btn btn-outline-success"
                                                onClick={() =>
                                                    handleEditarEmpresa(empresa)
                                                }
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-outline-danger"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleDeleteClick(
                                                        empresa.id
                                                    );
                                                }}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    )}
                                </div>
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
                            onClick={(e) => e.stopPropagation()}
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
                            <h2 style={{ color: "#b3e5fc" }}>
                                {selectedEmpresa.nombre}
                            </h2>
                            <p style={{ margin: "16px 0" }}>
                                {selectedEmpresa.descripcion}
                            </p>
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
                {/* Modal de edición de empresa */}
                {editEmpresa && (
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
                            zIndex: 1100,
                        }}
                        onClick={() => setEditEmpresa(null)}
                    >
                        <div
                            style={{
                                background: "#222",
                                borderRadius: 12,
                                padding: 32,
                                minWidth: 320,
                                maxWidth: 600,
                                color: "#fff",
                                position: "relative",
                                boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
                            }}
                            onClick={(e) => e.stopPropagation()}
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
                                onClick={() => setEditEmpresa(null)}
                            >
                                ×
                            </button>
                            <h2 style={{ color: "#b3e5fc" }}>Editar Empresa</h2>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleGuardarEdicion();
                                }}
                            >
                                <div className="mb-3">
                                    <label className="form-label">Nombre</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={editEmpresa.nombre}
                                        onChange={(e) =>
                                            setEditEmpresa({
                                                ...editEmpresa,
                                                nombre: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">
                                        Descripción
                                    </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={editEmpresa.descripcion}
                                        onChange={(e) =>
                                            setEditEmpresa({
                                                ...editEmpresa,
                                                descripcion: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Logo</label>
                                    <ImageUpload
                                        endpoint="empresa-logo"
                                        onImageUpload={(url: string) =>
                                            setEditEmpresa({
                                                ...editEmpresa,
                                                logoUrl: url,
                                            })
                                        }
                                    />
                                    {editEmpresa.logoUrl && (
                                        <img
                                            src={editEmpresa.logoUrl}
                                            alt="Logo preview"
                                            style={{
                                                width: 120,
                                                height: 120,
                                                objectFit: "contain",
                                                marginTop: 8,
                                                background: "#fff",
                                                borderRadius: 8,
                                            }}
                                        />
                                    )}
                                </div>
                                {editError && (
                                    <div style={{ color: "#ff5252" }}>
                                        {editError}
                                    </div>
                                )}
                                <div
                                    style={{
                                        display: "flex",
                                        gap: 12,
                                        marginTop: 16,
                                    }}
                                >
                                    <button
                                        className="btn submit-button"
                                        type="submit"
                                        disabled={editLoading}
                                    >
                                        Guardar
                                    </button>
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={() => setEditEmpresa(null)}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmpresaView;
