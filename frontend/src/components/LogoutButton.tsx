import { Link } from "react-router-dom";
import { handleLogout } from "../screens/Home";

const LogoutButton = () => {
    return (
        <Link
            to={""}
            className="btn btn-outline-primary"
            onClick={handleLogout}
        >
            Cerrar sesión
        </Link>
    );
};

export default LogoutButton;
