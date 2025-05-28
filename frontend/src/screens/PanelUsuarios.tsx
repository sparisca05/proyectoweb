import React, { useEffect, useState } from "react";
import { FaSave, FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import { deleteUsuario, updateUsuario } from "../api/usuarios.ts";
import Confirmation from "../components/Confirmation.tsx";
import Loading from "../components/Loading.tsx";
import { useUsuario } from "../contexts/UsuarioContext.tsx";

interface Usuario {
    id: number;
    username: string;
    correo: string;
    nombre: string;
    apellido: string;
    rol: string;
}

function PanelUsuarios({
    usuarios,
    loading,
}: {
    usuarios?: Usuario[];
    loading?: boolean;
}) {
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [usuariosList, setUsuariosList] = useState<Usuario[]>(usuarios || []);
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [editedUser, setEditedUser] = useState<Usuario | null>(null);
    const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

    const currentUser = useUsuario();

    useEffect(() => {
        if (usuarios) {
            setUsuariosList(
                usuarios.filter((u) => u.id !== currentUser?.usuario?.id)
            );
        }
    }, [usuarios]);

    const handleEditClick = (user: Usuario) => {
        setEditingUserId(user.id);
        setEditedUser({ ...user });
        setSuccessMessage("");
    };

    const handleCancelEdit = () => {
        setEditingUserId(null);
        setEditedUser(null);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
        field: keyof Usuario
    ) => {
        if (editedUser) {
            setEditedUser({ ...editedUser, [field]: e.target.value });
        }
    };

    const handleSaveClick = async (userId: number) => {
        if (!editedUser) return;

        try {
            const usuario = await updateUsuario(editedUser);

            setUsuariosList((prevUsuarios) =>
                prevUsuarios.map((user) =>
                    user.id === userId ? usuario : user
                )
            );
            setEditingUserId(null);
            setEditedUser(null);
            setSuccessMessage("Usuario actualizado con éxito");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
            setError("No se pudo actualizar el usuario");
            setTimeout(() => setError(""), 3000);
        }
    };

    const handleDeleteClick = (user: Usuario) => {
        setDeletingUserId(user.id);
        setShowConfirmation(true);
    };

    const confirmDelete = (id: number) => {
        handleDelete(id);
        setShowConfirmation(false);
    };

    const cancelDelete = () => {
        setShowConfirmation(false);
    };

    const handleDelete = async (userId: number) => {
        try {
            await deleteUsuario(userId);
            setUsuariosList((prevUsuarios) =>
                prevUsuarios.filter((user) => user.id !== userId)
            );
            setSuccessMessage("Usuario eliminado con éxito");
            // Quitar el mensaje después de 3 segundos
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            console.error("Error al eliminar el usuario:", error);
            setError("No se pudo eliminar el usuario");
            setTimeout(() => setError(""), 3000);
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <h1>Panel de Usuarios</h1>
            {showConfirmation && (
                <Confirmation
                    title="Eliminar Usuario"
                    message="¿Estás seguro que deseas eliminar este usuario?"
                    confirmText="Eliminar"
                    onConfirm={() => confirmDelete(deletingUserId || 0)}
                    onCancel={cancelDelete}
                />
            )}
            {error ? <div className="alert alert-danger">{error}</div> : null}
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
                        minWidth: "800px",
                        width: "100%",
                        marginBottom: 0,
                    }}
                >
                    {" "}
                    <thead>
                        <tr>
                            <th style={{ minWidth: "120px" }}>Nombre</th>
                            <th style={{ minWidth: "120px" }}>Apellido</th>
                            <th style={{ minWidth: "120px" }}>Usuario</th>
                            <th style={{ minWidth: "180px" }}>Email</th>
                            <th style={{ minWidth: "120px" }}>Rol</th>
                            <th style={{ minWidth: "120px" }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuariosList?.map((user) => (
                            <tr
                                key={user.id}
                                style={{
                                    backgroundColor:
                                        editingUserId === user.id
                                            ? "rgba(0, 123, 255, 0.1)"
                                            : "",
                                }}
                            >
                                {" "}
                                <td>
                                    {editingUserId === user.id ? (
                                        <input
                                            type="text"
                                            value={editedUser?.nombre || ""}
                                            onChange={(e) =>
                                                handleInputChange(e, "nombre")
                                            }
                                            className="form-control"
                                            onClick={(e) => e.stopPropagation()}
                                            style={{ minWidth: "120px" }}
                                        />
                                    ) : (
                                        user.nombre
                                    )}
                                </td>
                                <td>
                                    {editingUserId === user.id ? (
                                        <input
                                            type="text"
                                            value={editedUser?.apellido || ""}
                                            onChange={(e) =>
                                                handleInputChange(e, "apellido")
                                            }
                                            className="form-control"
                                            onClick={(e) => e.stopPropagation()}
                                            style={{ minWidth: "120px" }}
                                        />
                                    ) : (
                                        user.apellido
                                    )}
                                </td>
                                <td>
                                    {editingUserId === user.id ? (
                                        <input
                                            type="text"
                                            value={editedUser?.username || ""}
                                            onChange={(e) =>
                                                handleInputChange(e, "username")
                                            }
                                            className="form-control"
                                            onClick={(e) => e.stopPropagation()}
                                            style={{ minWidth: "120px" }}
                                        />
                                    ) : (
                                        user.username
                                    )}
                                </td>
                                <td>
                                    {editingUserId === user.id ? (
                                        <input
                                            type="email"
                                            value={editedUser?.correo || ""}
                                            onChange={(e) =>
                                                handleInputChange(e, "correo")
                                            }
                                            className="form-control"
                                            onClick={(e) => e.stopPropagation()}
                                            style={{ minWidth: "180px" }}
                                        />
                                    ) : (
                                        user.correo
                                    )}
                                </td>
                                <td>
                                    {editingUserId === user.id ? (
                                        <select
                                            value={editedUser?.rol || ""}
                                            onChange={(e) =>
                                                handleInputChange(e, "rol")
                                            }
                                            className="form-control"
                                            onClick={(e) => e.stopPropagation()}
                                            style={{ minWidth: "120px" }}
                                        >
                                            <option value="" disabled>
                                                Selecciona un rol
                                            </option>
                                            <option value="ADMIN">ADMIN</option>
                                            <option value="PARTICIPANTE">
                                                PARTICIPANTE
                                            </option>
                                        </select>
                                    ) : (
                                        user.rol
                                    )}
                                </td>
                                <td style={{ minWidth: "120px" }}>
                                    {editingUserId === user.id ? (
                                        <div className="btn-group">
                                            <button
                                                className="btn btn-sm btn-success"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSaveClick(user.id);
                                                }}
                                                title="Guardar cambios"
                                            >
                                                <FaSave />
                                            </button>
                                            <button
                                                className="btn btn-sm btn-secondary"
                                                onClick={(e) => {
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
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditClick(user);
                                                }}
                                                title="Editar usuario"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteClick(user);
                                                }}
                                                title="Eliminar usuario"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}{" "}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default PanelUsuarios;
