import { Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { isLoggedIn } from "../screens/Home.tsx";
import ProfileIcon from "./ProfileIcon.tsx";
import LoginButton from "./LoginButton.tsx";
import LogoutButton from "./LogoutButton.tsx";
import logo_url from "../assets/Imagen de WhatsApp 2025-03-22 a las 15.48.24_a903337e.jpg";
import UsuarioContext from "../contexts/UsuarioContext.tsx";

const Navbar = () => {
    const usuario = useContext(UsuarioContext);
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

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
                    {/* Logo */}
                    {title()}

                    {/* Desktop Navigation */}
                    <div className={"nav-links desktop-nav"}>
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
                                to={"/panel-admin"}
                                className={`nav-link ${
                                    window.location.pathname.includes(
                                        "/panel-admin"
                                    )
                                        ? "active"
                                        : ""
                                }`}
                            >
                                Panel de Administrador
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
                        <Link
                            to={"/empresas"}
                            className={`nav-link ${
                                window.location.pathname.includes("/empresas")
                                    ? "active"
                                    : ""
                            }`}
                        >
                            Empresas Patrocinadoras
                        </Link>
                    </div>

                    {/* Desktop Auth Section */}
                    <div className="desktop-auth">
                        {isLoggedIn() ? (
                            location.pathname !== "/perfil" ? (
                                <ProfileIcon
                                    username={
                                        usuario?.usuario?.username ||
                                        "Iniciar sesión"
                                    }
                                    link={
                                        usuario?.usuario ? "/perfil" : "/login"
                                    }
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
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="mobile-menu-btn"
                        onClick={toggleMobileMenu}
                        aria-label="Toggle mobile menu"
                    >
                        <span
                            className={`hamburger ${
                                isMobileMenuOpen ? "open" : ""
                            }`}
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </span>
                    </button>

                    {/* Mobile Menu */}
                    <div
                        className={`mobile-menu ${
                            isMobileMenuOpen ? "open" : ""
                        }`}
                    >
                        <div className="mobile-menu-content">
                            <Link
                                to={"/eventos"}
                                className={`mobile-nav-link ${
                                    window.location.pathname.includes(
                                        "/eventos"
                                    )
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Eventos
                            </Link>
                            <Link
                                to={"/hitos"}
                                className={`mobile-nav-link ${
                                    window.location.pathname.includes("/hitos")
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Hitos
                            </Link>
                            {usuario?.usuario?.rol === "ADMIN" && (
                                <Link
                                    to={"/panel-admin"}
                                    className={`mobile-nav-link ${
                                        window.location.pathname.includes(
                                            "/panel-admin"
                                        )
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Panel de Administrador
                                </Link>
                            )}
                            <Link
                                to={"/historico-eventos"}
                                className={`mobile-nav-link ${
                                    window.location.pathname.includes(
                                        "/historico-eventos"
                                    )
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Histórico de Eventos
                            </Link>
                            <Link
                                to={"/empresas"}
                                className={`mobile-nav-link ${
                                    window.location.pathname.includes(
                                        "/empresas"
                                    )
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Empresas Patrocinadoras
                            </Link>

                            {/* Mobile Auth Section */}
                            <div className="mobile-auth">
                                {isLoggedIn() ? (
                                    location.pathname !== "/perfil" ? (
                                        <ProfileIcon
                                            username={
                                                usuario?.usuario?.username ||
                                                "Iniciar sesión"
                                            }
                                            link={
                                                usuario?.usuario
                                                    ? "/perfil"
                                                    : "/login"
                                            }
                                        />
                                    ) : (
                                        <LogoutButton />
                                    )
                                ) : (
                                    <div className="mobile-auth-buttons">
                                        <LoginButton submit={false} />
                                        <Link
                                            to={"/register"}
                                            className="btn submit-button"
                                            onClick={() =>
                                                setIsMobileMenuOpen(false)
                                            }
                                        >
                                            Registrarse
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            </div>
        </nav>
    );
};

export default Navbar;
