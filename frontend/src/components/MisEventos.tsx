import { useEffect, useState } from "react";
import { Evento } from "../screens/Eventos.tsx";
import { Link } from "react-router-dom";
import { getToken } from "../screens/Home.tsx";
import { getEventosUsuario } from "../api/usuarios.ts";

const MisEventos = () => {
    const [eventos, setEventos] = useState<Evento[]>([]); // Estado para almacenar la lista de eventos
    const [loading, setLoading] = useState<boolean>(true); // Estado para mostrar una carga
    const [error, setError] = useState(""); // Estado para mostrar un error

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                setLoading(true);
                const token = getToken();
                if (!token) {
                    window.location.href = "/login";
                    return;
                }

                const eventos = await getEventosUsuario();

                setEventos(eventos);
                setError("");
            } catch (error) {
                console.error("Error fetching eventos:", error);
                setError("Error: " + error);
            } finally {
                setLoading(false);
            }
        };

        fetchEventos();
    }, []);

    if (loading) {
        return (
            <div>
                <div>Cargando eventos...</div>
            </div>
        );
    }

    const noEventosMessage = eventos.length === 0 && (
        <div>No estás en ningún evento aún.</div>
    );

    return (
        <>
            <h2>Mis Eventos</h2>
            {error ? <div>{error}</div> : noEventosMessage}
            <div>
                {eventos.map((evento) => (
                    <Link
                        to={`/eventos/${evento.id}`}
                        key={evento.id}
                        className="evento evento-profile"
                    >
                        <p>{evento.nombre}</p>
                        <div>
                            <p>Fecha: </p>
                            {evento.fecha}
                        </div>
                    </Link>
                ))}
            </div>
        </>
    );
};

export default MisEventos;
