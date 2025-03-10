import Navbar from "../components/Navbar.tsx";
import { useEffect, useState } from "react";
import { API_URL } from "../main.tsx";
import { getToken } from "./Home.tsx";

const NuevoEvento = () => {
    const [nombre, setNombre] = useState<string>("");
    const [fecha, setFecha] = useState<string>("");
    const [tipo, setTipo] = useState<string>("");
    const [empresas, setEmpresas] = useState([
        {
            id: "",
            nombre: "",
        },
    ]);
    const [empresaPatrocinadora, setEmpresaPatrocinadora] =
        useState<string>("");

    const fetchEmpresas = async () => {
        try {
            const response = await fetch(`${API_URL}/api/v1/empresas`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + getToken(),
                },
            });
            if (response.ok) {
                const data = await response.json();
                setEmpresas(
                    data.map((empresa: { id: string; nombre: string }) => ({
                        id: empresa.id,
                        nombre: empresa.nombre,
                    }))
                );
            } else {
                alert("Error al cargar las empresas");
            }
        } catch (error) {
            alert("Error de conexión. Por favor, intenta más tarde.");
            console.log(error);
        }
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        console.log(nombre, fecha, tipo, empresaPatrocinadora);
        const requestBody = {
            nombre: nombre,
            fecha: fecha,
            tipo: tipo,
            empresaPatrocinadora: empresaPatrocinadora,
        };

        try {
            const response = await fetch(
                `${API_URL}/api/v1/eventos/nuevo-evento`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + getToken(),
                    },
                    body: JSON.stringify(requestBody),
                }
            );

            if (response.ok) {
                alert("Evento creado exitosamente!");
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Error al crear el evento");
            }
        } catch (error) {
            alert("Error de conexión. Por favor, intenta más tarde.");
            console.log(error);
        }
    };

    useEffect(() => {
        fetchEmpresas();
    }, []);

    return (
        <div className={"main-container"}>
            <Navbar />
            <div className={"welcome"}>
                <div className={"auth-container"}>
                    <h2>Nuevo evento</h2>
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
                                    Tipo del evento
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    aria-label="Sizing example input"
                                    aria-describedby="inputGroup-sizing-default"
                                    value={tipo}
                                    onChange={(e) => setTipo(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col">
                                <label
                                    className="form-label"
                                    id="inputGroup-sizing-default"
                                >
                                    Fecha
                                </label>
                                <input
                                    type="date"
                                    className="form-control"
                                    aria-label="Sizing example input"
                                    aria-describedby="inputGroup-sizing-default"
                                    value={fecha}
                                    onChange={(e) => setFecha(e.target.value)}
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
                                value={empresaPatrocinadora}
                                defaultValue={""}
                                onChange={(e) =>
                                    setEmpresaPatrocinadora(e.target.value)
                                }
                            >
                                <option value="" disabled>
                                    Escoge una...
                                </option>
                                {empresas.map((empresa, index) => (
                                    <option key={index} value={empresa.id}>
                                        {empresa.nombre}
                                    </option>
                                ))}
                            </select>
                            <a className="" href="/nueva-empresa">
                                + Añadir una nueva
                            </a>
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Crear evento
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NuevoEvento;
