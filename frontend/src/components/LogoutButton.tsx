import { Link, useNavigate } from "react-router-dom";
import { handleLogout } from "../screens/Home";
import { useUsuario } from "../contexts/UsuarioContext";
import { useState } from "react";

const LogoutButton = () => {
    const navigate = useNavigate();
    const { setUsuario } = useUsuario()!;
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleLogoutClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowConfirmation(true);
    };

    const confirmLogout = () => {
        handleLogout(navigate, setUsuario);
        setShowConfirmation(false);
    };

    const cancelLogout = () => {
        setShowConfirmation(false);
    };

    return (
        <>
            <Link
                to={""}
                className="navbar-profile"
                onClick={handleLogoutClick}
            >
                Cerrar sesión
            </Link>

            {showConfirmation && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "white",
                            padding: "20px",
                            borderRadius: "5px",
                            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                            maxWidth: "400px",
                            width: "100%",
                        }}
                    >
                        <h3 style={{ marginTop: 0 }}>Cerrar sesión</h3>
                        <p>¿Estás seguro de que deseas cerrar la sesión?</p>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "10px",
                                marginTop: "20px",
                            }}
                        >
                            <button
                                onClick={cancelLogout}
                                style={{
                                    padding: "8px 16px",
                                    backgroundColor: "#ccc",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmLogout}
                                style={{
                                    padding: "8px 16px",
                                    backgroundColor: "#f44336",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                }}
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default LogoutButton;
