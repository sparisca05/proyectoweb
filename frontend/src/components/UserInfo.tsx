import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useUsuario } from "../contexts/UsuarioContext";
import { getToken } from "../screens/Home";
import { API_URL } from "../main";
import { handleLogout } from "../screens/Home";

const UserInfo = () => {
    let user = useUsuario();
    const navigate = useNavigate();
    const { setUsuario } = useUsuario()!;
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        nombre: "",
        apellido: "",
        username: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (user && user.usuario) {
            setUserData({
                nombre: user.usuario.nombre || "",
                apellido: user.usuario.apellido || "",
                username: user.usuario.username || "",
                password: "", // No se muestra la contraseña por razones de seguridad
            });
        }
    }, [user]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setError("");
        setSuccess("");
    };

    const handleInputChange = (e: { target: { name: any; value: any } }) => {
        const { name, value } = e.target;
        setUserData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            // Asumiendo que existe un endpoint para actualizar usuarios
            // Ajusta la URL según tu API
            const response = await axios.put(
                `${API_URL}/api/v1/usuario/perfil`,
                userData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getToken()}`,
                    },
                }
            );

            if (response.status === 200) {
                setSuccess("¡Información actualizada con éxito!");
                setIsEditing(false);
                handleLogout(navigate, setUsuario);
                window.location.reload();
            }
        } catch (err) {
            setError(
                "Error al actualizar la información. Por favor, inténtelo de nuevo."
            );
            console.error("Error actualizando usuario:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <h2>Perfil</h2>
            <div>
                {user ? (
                    <div>
                        {!isEditing ? (
                            <>
                                <div className={"name"}>
                                    <p
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: "28px",
                                        }}
                                    >
                                        {user.usuario?.nombre}{" "}
                                        {user.usuario?.apellido}
                                    </p>
                                    <p>{user.usuario?.username}</p>
                                </div>
                                <p>Rol: {user.usuario?.rol}</p>
                                <button
                                    onClick={handleEditToggle}
                                    style={{
                                        padding: "8px 16px",
                                        backgroundColor: "#4CAF50",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Editar
                                </button>
                            </>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: "15px" }}>
                                    <label
                                        style={{
                                            display: "block",
                                            marginBottom: "5px",
                                        }}
                                    >
                                        Nombre:
                                    </label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={userData.nombre}
                                        onChange={handleInputChange}
                                        style={{
                                            width: "100%",
                                            padding: "8px",
                                            borderRadius: "4px",
                                            border: "1px solid #ccc",
                                        }}
                                    />
                                </div>
                                <div style={{ marginBottom: "15px" }}>
                                    <label
                                        style={{
                                            display: "block",
                                            marginBottom: "5px",
                                        }}
                                    >
                                        Apellido:
                                    </label>
                                    <input
                                        type="text"
                                        name="apellido"
                                        value={userData.apellido}
                                        onChange={handleInputChange}
                                        style={{
                                            width: "100%",
                                            padding: "8px",
                                            borderRadius: "4px",
                                            border: "1px solid #ccc",
                                        }}
                                    />
                                </div>
                                <div style={{ marginBottom: "15px" }}>
                                    <label
                                        style={{
                                            display: "block",
                                            marginBottom: "5px",
                                        }}
                                    >
                                        Nombre de usuario:
                                    </label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={userData.username}
                                        onChange={handleInputChange}
                                        style={{
                                            width: "100%",
                                            padding: "8px",
                                            borderRadius: "4px",
                                            border: "1px solid #ccc",
                                        }}
                                    />
                                </div>
                                <div style={{ marginBottom: "15px" }}>
                                    <label
                                        style={{
                                            display: "block",
                                            marginBottom: "5px",
                                        }}
                                    >
                                        Rol:
                                    </label>
                                    <input
                                        type="text"
                                        name="rol"
                                        value={user.usuario?.rol}
                                        onChange={handleInputChange}
                                        style={{
                                            width: "100%",
                                            padding: "8px",
                                            borderRadius: "4px",
                                            border: "1px solid #ccc",
                                        }}
                                        disabled={true} // El rol generalmente no se cambia desde este formulario
                                    />
                                </div>
                                {error && (
                                    <p style={{ color: "red" }}>{error}</p>
                                )}
                                {success && (
                                    <p style={{ color: "green" }}>{success}</p>
                                )}
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        style={{
                                            padding: "8px 16px",
                                            backgroundColor: "#4CAF50",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: isLoading
                                                ? "not-allowed"
                                                : "pointer",
                                            opacity: isLoading ? 0.7 : 1,
                                        }}
                                    >
                                        {isLoading ? "Guardando..." : "Guardar"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleEditToggle}
                                        disabled={isLoading}
                                        style={{
                                            padding: "8px 16px",
                                            backgroundColor: "#f44336",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: isLoading
                                                ? "not-allowed"
                                                : "pointer",
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                ) : (
                    <p>No se encontraron datos del usuario.</p>
                )}
            </div>
        </>
    );
};

export default UserInfo;
