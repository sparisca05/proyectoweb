import Navbar from "../components/Navbar.tsx";
import { useEffect, useState } from "react";
import { API_URL } from "../main.tsx";
import { getToken } from "./Home.tsx";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export interface Empresa {
    id: number;
    nombre: string;
    descripcion: string;
    logo: string;
    eventos: any[];
}

function NuevoEvento() {
    const [nombre, setNombre] = useState<string>("");
    const [fecha, setFecha] = useState<string>("");
    const [hora, setHora] = useState<string>("");
    const [tipo, setTipo] = useState<string>("");
    const [nombreOrganizador, setNombreOrganizador] = useState<string>("");
    const [contactoOrganizador, setContactoOrganizador] = useState<string>("");
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [empresaPatrocinadora, setEmpresaPatrocinadora] = useState<Empresa>();

    const navigate = useNavigate();

    useEffect(() => {
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
                    setEmpresas(data);
                } else {
                    alert("Error al cargar las empresas");
                }
            } catch (error) {
                alert("Error de conexión. Por favor, intenta más tarde.");
                console.log(error);
            }
        };
        fetchEmpresas();
    }, []);

    const handleEmpresaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedEmpresa = empresas.find(
            (empresa) => empresa.id === Number(e.target.value)
        );
        setEmpresaPatrocinadora(selectedEmpresa || undefined);
    };
    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        // Combine date and time, then format to "dd-MM-yyyy HH:mm"
        const [year, month, day] = fecha.split("-");
        const formattedFecha = `${day}-${month}-${year} ${hora}`;

        const requestBody = {
            nombre: nombre,
            fecha: formattedFecha,
            tipo: tipo,
            nombreOrganizador: nombreOrganizador,
            contactoOrganizador: contactoOrganizador,
            empresaPatrocinadora: {
                id: empresaPatrocinadora?.id,
            },
        };
        console.log(requestBody);

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
                navigate("/eventos");
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Error al crear el evento");
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
                        </div>{" "}
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
                                    onChange={(e) => [
                                        setFecha(e.target.value),
                                        console.log(fecha),
                                    ]}
                                    required
                                />
                            </div>
                            <div className="col">
                                <label
                                    className="form-label"
                                    id="inputGroup-sizing-default"
                                >
                                    Hora
                                </label>
                                <input
                                    type="time"
                                    className="form-control"
                                    aria-label="Sizing example input"
                                    aria-describedby="inputGroup-sizing-default"
                                    value={hora}
                                    onChange={(e) => setHora(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col">
                                <label
                                    className="form-label"
                                    id="inputGroup-sizing-default"
                                >
                                    Nombre del organizador
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    aria-label="Sizing example input"
                                    aria-describedby="inputGroup-sizing-default"
                                    value={nombreOrganizador}
                                    onChange={(e) =>
                                        setNombreOrganizador(e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="col">
                                <label
                                    className="form-label"
                                    id="inputGroup-sizing-default"
                                >
                                    Contacto del organizador
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    aria-label="Sizing example input"
                                    aria-describedby="inputGroup-sizing-default"
                                    value={contactoOrganizador}
                                    onChange={(e) =>
                                        setContactoOrganizador(e.target.value)
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
                                value={empresaPatrocinadora?.id || ""}
                                onChange={handleEmpresaChange}
                            >
                                <option value="" disabled>
                                    Escoge una...
                                </option>
                                {empresas.map((empresa) => (
                                    <option key={empresa.id} value={empresa.id}>
                                        {empresa.nombre}
                                    </option>
                                ))}
                            </select>
                            <a className="" href="/nueva-empresa">
                                + Crear nueva empresa
                            </a>
                        </div>
                        <button type="submit" className="btn submit-button">
                            Crear evento
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default NuevoEvento;
