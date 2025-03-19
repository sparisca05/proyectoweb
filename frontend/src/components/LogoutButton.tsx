import { Link, useNavigate } from "react-router-dom";
import { handleLogout } from "../screens/Home";

const LogoutButton = () => {
    const navigate = useNavigate();

    return (
        <Link
            to={""}
            className="btn btn-outline-primary"
            onClick={() => handleLogout(navigate)}
        >
            Cerrar sesión
        </Link>
    );
};

export default LogoutButton;
