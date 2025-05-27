import { useEffect, useState } from "react";
import { Evento } from "../screens/Eventos.tsx";
import { Link } from "react-router-dom";
import { getEventosUsuario } from "../api/usuarios.ts";
import { MdLock, MdPublic } from "react-icons/md";
import { FaCalendarDays } from "react-icons/fa6";

const MisEventos = () => {
    const [eventos, setEventos] = useState<Evento[]>([]); // Estado para almacenar la lista de eventos
    const [loading, setLoading] = useState<boolean>(true); // Estado para mostrar una carga
    const [error, setError] = useState(""); // Estado para mostrar un error

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                setLoading(true);

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
                        className="evento"
                    >
                        {evento.publico ? (
                            <MdPublic className="visibility-icon" size={30} />
                        ) : (
                            <MdLock className="visibility-icon" size={30} />
                        )}
                        <h5>{evento.tipo}</h5>
                        <h4>{evento.nombre}</h4>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                            }}
                        >
                            <FaCalendarDays />
                            <p>Fecha: </p>
                            {evento.fecha}
                        </div>
                        {evento.imagenUrl && (
                            <img
                                src={evento.imagenUrl}
                                alt={evento.nombre}
                                style={{
                                    height: "200px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                    marginBottom: "10px",
                                }}
                            />
                        )}
                    </Link>
                ))}
            </div>
        </>
    );
};

export default MisEventos;
