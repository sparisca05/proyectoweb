import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";

import Navbar from "../components/Navbar";
import { API_URL } from "../main";

function NuevaEmpresa() {
    const [nombre, setNombre] = useState<string>("");
    const [descripcion, setDescripcion] = useState<string>("");
    const [logo, setLogo] = useState<string>("");

    const navigate = useNavigate();

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        const requestBody = {
            nombre: nombre,
            descripcion: descripcion,
            logo: logo,
        };

        if (!nombre || !descripcion || !logo) {
            alert("Por favor, llena todos los campos.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/v1/empresas`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer " + localStorage.getItem("authToken"),
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                alert("Empresa creada exitosamente");
                navigate("/eventos/nuevo-evento");
            } else {
                alert("Error al crear la empresa");
            }
        } catch (error) {
            alert("Error de conexión. Por favor, intenta más tarde.");
            console.log(error);
        }
    };

    return (
        <div className="main-container">
            <Navbar />
            <div className="welcome">
                <div className="auth-container">
                    <IoMdClose
                        className="back-btn"
                        onClick={() => navigate("/eventos/nuevo-evento")}
                    />
                    <h2>Registrar empresa</h2>
                    <form>
                        <div className="mb-3">
                            <span
                                className="form-label"
                                id="inputGroup-sizing-default"
                            >
                                Nombre
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                aria-label="Sizing example input"
                                aria-describedby="inputGroup-sizing-default"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <span
                                className="form-label"
                                id="inputGroup-sizing-default"
                            >
                                Descripción
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                aria-label="Sizing example input"
                                aria-describedby="inputGroup-sizing-default"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <span
                                className="form-label"
                                id="inputGroup-sizing-default"
                            >
                                Logo
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                aria-label="Sizing example input"
                                aria-describedby="inputGroup-sizing-default"
                                value={logo}
                                onChange={(e) => setLogo(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            onClick={handleSubmit}
                        >
                            Crear
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default NuevaEmpresa;
