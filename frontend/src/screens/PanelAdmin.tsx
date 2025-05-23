import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../main.tsx";
import Navbar from "../components/Navbar.tsx";
import { useUsuario } from "../contexts/UsuarioContext.tsx";
import { useNavigate } from "react-router-dom";
import { getToken } from "./Home.tsx";
import { FaSave, FaTimes, FaEdit } from "react-icons/fa";
import "../App.css";

interface Usuario {
    id: number;
    username: string;
    correo: string;
    nombre: string;
    apellido: string;
    rol: string;
}

const AdminPanel: React.FC = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState("");
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [editedUser, setEditedUser] = useState<Usuario | null>(null);
    const [successMessage, setSuccessMessage] = useState("");
    const usuario = useUsuario();
    const navigate = useNavigate();

    const token = getToken();
    if (!token) {
        window.location.href = "/login";
    }

    useEffect(() => {
        axios
            .get(`${API_URL}/api/v1/usuario`, {
                headers: {
                    Authorization: "Bearer " + token,
                },
            })
            .then((response) => {
                setUsuarios(response.data);
            })
            .catch((error) => {
                console.error("Error al obtener usuarios:", error);
                setError("No se pudieron cargar los usuarios.");
            })
            .finally(() => setLoading(false));
    }, [usuario, navigate]);

    if (loading) {
        return (
            <div className="main-container">
                <Navbar />
                <div className="eventos">
                    <h4 style={{ textAlign: "center", color: "white" }}>
                        Cargando usuarios...
                    </h4>
                </div>
            </div>
        );
    }
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
            const token = getToken();
            await axios.put(`${API_URL}/api/v1/usuario/${userId}`, editedUser, {
                headers: {
                    Authorization: "Bearer " + token,
                },
            });

            // Actualizar la lista de usuarios con el usuario editado
            setUsuarios(
                usuarios.map((u) => (u.id === userId ? editedUser : u))
            );
            setEditingUserId(null);
            setEditedUser(null);
            setSuccessMessage("Usuario actualizado con éxito");

            // Quitar el mensaje después de 3 segundos
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
            setError("No se pudo actualizar el usuario");
            setTimeout(() => setError(""), 3000);
        }
    };

    return (
        <div className="main-container">
            <Navbar />
            <div className="eventos">
                <h1>Panel de Usuarios</h1>
                {error ? (
                    <div className="alert alert-danger">{error}</div>
                ) : null}
                {successMessage ? (
                    <div className="alert alert-success">{successMessage}</div>
                ) : null}
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Usuario</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((user) => (
                            <tr
                                key={user.id}
                                onClick={() =>
                                    editingUserId !== user.id &&
                                    handleEditClick(user)
                                }
                                style={{
                                    cursor:
                                        editingUserId === user.id
                                            ? "default"
                                            : "pointer",
                                    backgroundColor:
                                        editingUserId === user.id
                                            ? "rgba(0, 123, 255, 0.1)"
                                            : "transparent",
                                }}
                            >
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
                                        />
                                    ) : (
                                        user.nombre
                                    )}
                                </td>{" "}
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
                                        >
                                            <option value="ADMIN">ADMIN</option>
                                            <option value="USER">
                                                PARTICIPANTE
                                            </option>
                                        </select>
                                    ) : (
                                        user.rol
                                    )}
                                </td>{" "}
                                <td>
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
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPanel;
