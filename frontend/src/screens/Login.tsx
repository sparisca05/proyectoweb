// noinspection TypeScriptCheckImport
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { API_URL } from "../main.tsx";
import LoginButton from "../components/LoginButton.tsx";
import Navbar from "../components/Navbar.tsx";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    // Verificar si hay un parámetro "expired" en la URL
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const expired = queryParams.get("expired");

        if (expired === "true") {
            setErrorMessage(
                "Su sesión ha expirado. Por favor inicie sesión nuevamente."
            );
        }
    }, []);
    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        // Crear el cuerpo del POST
        const requestBody = {
            username: username,
            password: password,
        };

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            console.log("Response:", response);

            if (!response.ok) {
                throw new Error("Error en la autenticación");
            }

            const data = await response.json();
            setErrorMessage("");

            // Guardar el token y su tiempo de expiración
            localStorage.setItem("authToken", data.token);

            // Si tenemos información de expiración, la guardamos también
            if (data.expiresIn) {
                console.log("Token expirará en:", data.expiresIn);
                localStorage.setItem(
                    "tokenExpiration",
                    data.expiresIn.toString()
                );
            }

            navigate("/eventos");
            window.location.reload();
        } catch (error) {
            setErrorMessage("Usuario o contraseña incorrectos.");
            console.log(error);
        }
    };

    return (
        <div className="main-container">
            <Navbar />
            <div className={"welcome"}>
                <div
                    className={"auth-container"}
                    style={{ alignItems: "unset" }}
                >
                    <h2 style={{ padding: "10px 0" }}>Iniciar Sesión</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Usuario</label>
                            <input
                                className="form-control"
                                type="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>{" "}
                        <div className="mb-3">
                            <label className={"form-label"}>Contraseña</label>
                            <div className="input-group">
                                <input
                                    className={"form-control"}
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />
                                <button
                                    id="show-password-btn"
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    style={{
                                        position: "absolute",
                                        zIndex: 10,
                                        padding: "0px 10px",
                                        right: "0px",
                                        background: "none",
                                        border: "none",
                                    }}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>
                        <LoginButton submit={true} />
                        <div style={{ margin: "10px 0" }}>
                            <p>
                                ¿No tienes una cuenta?{" "}
                                <Link
                                    to="/register"
                                    style={{ textDecoration: "none" }}
                                >
                                    Regístrate
                                </Link>
                            </p>
                        </div>
                        {errorMessage && (
                            <p
                                style={{
                                    color: "red",
                                    width: "100%",
                                    margin: "10px 0",
                                }}
                            >
                                {errorMessage}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
