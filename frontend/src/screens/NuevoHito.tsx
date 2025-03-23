import Navbar from "../components/Navbar.tsx";
import { useEffect, useState } from "react";
import { API_URL } from "../main.tsx";
import { getToken } from "./Home.tsx";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { Evento } from "./Eventos.tsx";

function NuevoHito() {
    const [nombre, setNombre] = useState<string>("");
    const [categoria, setCategoria] = useState<string>("");
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [eventoRelevante, setEventoRelevante] = useState<any>();
    const [ganadores, setGanadores] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const navigate = useNavigate();

    useEffect(() => {
        const token = getToken();

        fetch(`${API_URL}/api/v1/eventos`, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + token,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setEventos(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, []);

    const handleEventoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedEvento = eventos.find(
            (evento) => evento.id === Number(e.target.value)
        );
        setEventoRelevante(selectedEvento || undefined);
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        const requestBody = {
            nombre: nombre,
            categoria: categoria,
            eventoRelevante: eventoRelevante,
            ganadores: ganadores,
        };

        try {
            const response = await fetch(`${API_URL}/api/v1/hitos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + getToken(),
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                alert("Hito registrado con éxito.");
                navigate("/hitos");
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Error al registrar el hito.");
            }
        } catch (error) {
            alert("Error de conexión. Por favor, intenta más tarde.");
            console.log(error);
        }
    };

    return (
        <div className={"main-container"}>
            <Navbar />
            <div className={"welcome"}>
                <div className={"auth-container"}>
                    <IoMdClose
                        className="back-btn"
                        onClick={() => navigate("/eventos")}
                    />
                    <h2>Nuevo hito</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label
                                className="form-label"
                                id="inputGroup-sizing-default"
                            >
                                Nombre
                            </label>
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
                        <div className="row mb-3">
                            <div className="col">
                                <label
                                    className="form-label"
                                    id="inputGroup-sizing-default"
                                >
                                    Categoría
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    aria-label="Sizing example input"
                                    aria-describedby="inputGroup-sizing-default"
                                    value={categoria}
                                    onChange={(e) =>
                                        setCategoria(e.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="empresa-patrocinadora"
                                className="form-label"
                            >
                                Empresa patrocinadora
                            </label>
                            <select
                                name="empresa-patrocinadora"
                                id="empresa-patrocinadora"
                                className="form-select"
                                value={eventoRelevante?.id || ""}
                                onChange={handleEventoChange}
                            >
                                <option value="" disabled>
                                    Escoge una...
                                </option>
                                {eventos.map((evento) => (
                                    <option key={evento.id} value={evento.id}>
                                        {evento.nombre}
                                    </option>
                                ))}
                            </select>
                            <a className="" href="/nueva-empresa">
                                + Añadir una nueva
                            </a>
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Guardar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default NuevoHito;
