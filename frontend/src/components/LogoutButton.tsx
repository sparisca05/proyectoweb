import { Link, useNavigate } from "react-router-dom";
import { handleLogout } from "../screens/Home";
import { useUsuario } from "../contexts/UsuarioContext";

const LogoutButton = () => {
    const navigate = useNavigate();
    const { setUsuario } = useUsuario()!;

    return (
        <Link
            to={""}
            className="btn btn-outline-primary"
            onClick={() => handleLogout(navigate, setUsuario)}
        >
            Cerrar sesión
        </Link>
    );
};

export default LogoutButton;
