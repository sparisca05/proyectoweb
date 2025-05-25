import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { isLoggedIn } from "../screens/Home.tsx";
import ProfileIcon from "./ProfileIcon.tsx";
import LoginButton from "./LoginButton.tsx";
import LogoutButton from "./LogoutButton.tsx";
import logo_url from "../assets/Imagen de WhatsApp 2025-03-22 a las 15.48.24_a903337e.jpg";
import UsuarioContext from "../contexts/UsuarioContext.tsx";

const Navbar = () => {
    const usuario = useContext(UsuarioContext);
    const location = useLocation();

    const title = () => {
        return (
            <Link to="/" style={{ textDecoration: "none" }}>
                <img
                    src={logo_url}
                    style={{ height: "70px", cursor: "pointer" }}
                />
            </Link>
        );
    };

    return (
        <nav className={"navbar "} style={{ width: "100%" }}>
            <div className={"container-fluid"}>
                <>
                    <div className={"nav-links"}>
                        {title()}
                        <Link
                            to={"/eventos"}
                            className={`nav-link ${
                                window.location.pathname.includes("/eventos")
                                    ? "active"
                                    : ""
                            }`}
                        >
                            Eventos
                        </Link>
                        <Link
                            to={"/hitos"}
                            className={`nav-link ${
                                window.location.pathname.includes("/hitos")
                                    ? "active"
                                    : ""
                            }`}
                        >
                            Hitos
                        </Link>
                        {usuario?.usuario?.rol === "ADMIN" && (
                            <Link
                                to={"/PanelAdmin"}
                                className={`nav-link ${
                                    window.location.pathname.includes(
                                        "/PanelAdmin"
                                    )
                                        ? "active"
                                        : ""
                                }`}
                            >
                                Panel de Usuarios
                            </Link>
                        )}
                        <Link
                            to={"/historico-eventos"}
                            className={`nav-link ${
                                window.location.pathname.includes(
                                    "/historico-eventos"
                                )
                                    ? "active"
                                    : ""
                            }`}
                        >
                            Histórico de Eventos
                        </Link>
                    </div>
                    {isLoggedIn() ? (
                        location.pathname !== "/perfil" ? (
                            <ProfileIcon
                                username={
                                    usuario?.usuario?.username ||
                                    "Iniciar sesión"
                                }
                                link={usuario?.usuario ? "/perfil" : "/login"}
                            />
                        ) : (
                            <LogoutButton />
                        )
                    ) : (
                        <div style={{ display: "flex", columnGap: "10px" }}>
                            <LoginButton submit={false} />
                            <Link
                                to={"/register"}
                                className="btn submit-button"
                            >
                                Registrarse
                            </Link>
                        </div>
                    )}
                </>
            </div>
        </nav>
    );
};

export default Navbar;
