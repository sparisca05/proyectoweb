import { Link, NavigateFunction } from "react-router-dom";
import "../App.css";
import { Usuario } from "../contexts/UsuarioContext";

export const getToken: () => string | null = () => {
    const token = localStorage.getItem("authToken");
    const expiration = localStorage.getItem("tokenExpiration");

    // Si no hay token o fecha de expiración, simplemente devolver el token (o null)
    if (!token || !expiration) {
        return token;
    }

    // Verificar si el token ha expirado
    const expirationTime = parseInt(expiration, 10);
    const now = new Date().getTime();

    if (now >= expirationTime) {
        console.log("Token expirado");
        // El token ha expirado, limpiarlo
        localStorage.removeItem("authToken");
        localStorage.removeItem("tokenExpiration");

        // Redirigir al login con el parámetro expired=true
        if (window.location.pathname !== "/login") {
            window.location.href = "/login?expired=true";
        }
        return null;
    }

    return token;
};

export const isLoggedIn = () => {
    const token = getToken();
    return token !== null;
};

export const handleLogout = (
    navigate: NavigateFunction,
    setUsuario: React.Dispatch<React.SetStateAction<Usuario | null>>
) => {
    navigate("/login");
    localStorage.removeItem("authToken");
    setUsuario(null);
};

function Home() {
    return (
        <div className="home-container">
            <header className="hero-section">
                <h1>Eventos EIA</h1>
                <p>Descubre, crea y gestiona eventos fácilmente</p>
            </header>

            <section className="cta-buttons">
                {isLoggedIn() ? (
                    <Link to="/eventos" className="shadow__btn">
                        Explorar Eventos
                    </Link>
                ) : (
                    <>
                        <Link to="/login" className="btn submit-button outline">
                            Iniciar sesión
                        </Link>
                        <Link to="/register" className="btn submit-button">
                            Registrarse
                        </Link>
                    </>
                )}
            </section>

            <section className="info-section">
                <h2>¿Qué ofrecemos?</h2>
                <div className="features">
                    <div className="feature">
                        <h3>Organiza tus eventos</h3>
                        <p>
                            Planifica eventos con facilidad y comparte con tus
                            amigos.
                        </p>
                    </div>
                    <div className="feature">
                        <h3>Descubre nuevas experiencias</h3>
                        <p>
                            Explora eventos de diferentes categorías en un solo
                            lugar.
                        </p>
                    </div>
                    <div className="feature">
                        <h3>Conéctate con la comunidad</h3>
                        <p>
                            Únete a eventos, conoce gente y crea recuerdos
                            inolvidables.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
