import Navbar from "../components/Navbar.tsx";
import { useEffect, useState } from "react";
import { API_URL } from "../main.tsx";
import { getToken } from "./Home.tsx";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { Evento } from "./Eventos.tsx";
import { Usuario } from "../contexts/UsuarioContext.tsx";
import { getEventParticipants } from "../api/eventos.ts";

function NuevoHito() {
    const [nombre, setNombre] = useState<string>("");
    const [categoria, setCategoria] = useState<string>("");
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [eventoRelevante, setEventoRelevante] = useState<Evento>();
    const [ganadores, setGanadores] = useState<Usuario[]>([]);
    const [participants, setParticipants] = useState<Usuario[]>([
        {
            id: 0,
            nombre: "",
            apellido: "",
            username: "",
            correo: "",
            rol: "",
        },
    ]);
    const [searchTerm, setSearchTerm] = useState("");

    const navigate = useNavigate();

    const getParticipants = () => {
        eventoRelevante?.id &&
            getEventParticipants(eventoRelevante?.id).then((participants) => {
                setParticipants(participants);
                console.log(participants);
            });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleAddWinner = (usuario: Usuario) => {
        if (!ganadores.includes(usuario)) {
            setGanadores([...ganadores, usuario]);
        }
    };

    const filteredParticipants = participants.filter((usuario) =>
        usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                setEventos(data);
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

    useEffect(() => {
        if (eventoRelevante) {
            getParticipants();
        }
    }, [eventoRelevante]);

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        const requestBody = {
            nombre: nombre,
            categoria: categoria,
            eventoRelevante: {
                id: eventoRelevante?.id,
            },
            ganadores: ganadores.map((usuario) => ({
                id: usuario.id,
            })),
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
                        onClick={() => navigate("/hitos")}
                    />
                    <h2>Nuevo hito</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                            <div className="col">
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
                                Evento asociado
                            </label>
                            <select
                                name="empresa-patrocinadora"
                                id="empresa-patrocinadora"
                                className="form-select ganadores-select"
                                value={eventoRelevante?.id || ""}
                                onChange={handleEventoChange}
                            >
                                <option value="" disabled>
                                    Escoge uno...
                                </option>
                                {eventos.map((evento) => (
                                    <option key={evento.id} value={evento.id}>
                                        {evento.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            {eventoRelevante && (
                                <>
                                    <label
                                        htmlFor="seleccionar-ganadores"
                                        className="form-label"
                                    >
                                        Seleccionar ganadores
                                    </label>
                                    <input
                                        name="seleccionar-ganadores"
                                        id="seleccionar-ganadores"
                                        className="form-control"
                                        type="text"
                                        placeholder="Buscar por nombre"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                    />
                                    <select
                                        className="form-select ganadores-select"
                                        size={3}
                                        multiple
                                    >
                                        {filteredParticipants.map((usuario) => (
                                            <option
                                                className="list-group-item list-group-item-action"
                                                key={usuario.username}
                                                onClick={() =>
                                                    handleAddWinner(usuario)
                                                }
                                            >
                                                {usuario.nombre}{" "}
                                                {usuario.apellido}
                                            </option>
                                        ))}
                                    </select>
                                </>
                            )}
                        </div>
                        {ganadores.length > 0 && (
                            console.log(ganadores),
                            <div className="mb-3">
                                <label
                                    htmlFor="ganadores"
                                    className="form-label"
                                    style={{ color: "#fff" }} // Letras blancas en el label
                                >
                                    Ganadores
                                </label>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th style={{ color: "#fff" }}>Nombre</th>
                                            <th style={{ color: "#fff" }}>Apellido</th>
                                            <th style={{ color: "#fff" }}>Username</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        
                                        {ganadores.map((usuario) => (
                                            <tr key={usuario.username}>
                                                <td style={{ color: "#fff" }}>
                                                    {usuario.nombre}
                                                </td>
                                                <td style={{ color: "#fff" }}>
                                                    {usuario.apellido}
                                                </td>
                                                <td style={{ color: "#fff" }}>
                                                    {usuario.username}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
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
