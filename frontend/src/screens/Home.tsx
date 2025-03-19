// import React from 'react';

import { Link, NavigateFunction } from "react-router-dom";

export const getToken: () => string | null = () => {
    return localStorage.getItem("authToken");
};

export const isLoggedIn = () => {
    const token = getToken();
    return token !== null;
};

export const handleLogout = (navigate: NavigateFunction) => {
    navigate("/login");
    localStorage.removeItem("authToken");
};

function Home() {
    return (
        <div className="main-container">
            <div className={"welcome"}>
                <h3>Bienvenido a Eventos EIA</h3>
                <div style={{ display: "flex", columnGap: "10px" }}>
                    <Link to={"/login"} className={"btn btn-outline-primary"}>
                        Iniciar sesión
                    </Link>
                    <Link to={"/register"} className={"btn btn-primary"}>
                        Registrarse
                    </Link>
                </div>
                <Link to={"/eventos"} className={"btn btn-secondary"}>
                    Ver todos los eventos
                </Link>
            </div>
        </div>
    );
}

export default Home;
