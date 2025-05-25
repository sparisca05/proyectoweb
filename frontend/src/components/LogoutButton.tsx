import { Link, useNavigate } from "react-router-dom";
import { handleLogout } from "../screens/Home";
import { useUsuario } from "../contexts/UsuarioContext";
import { useState } from "react";
import Confirmation from "./Confirmation";

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
                <Confirmation
                    title="Cerrar sesión"
                    message="¿Estás seguro de que deseas cerrar sesión?"
                    confirmText="Cerrar sesión"
                    onConfirm={confirmLogout}
                    onCancel={cancelLogout}
                />
            )}
        </>
    );
};

export default LogoutButton;
