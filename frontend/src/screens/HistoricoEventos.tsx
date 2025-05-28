import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdPublic, MdLock } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import Navbar from "../components/Navbar";
import { Evento } from "./Eventos";
import { useUsuario } from "../contexts/UsuarioContext";
import { getEventos } from "../api/eventos";
import { getEventosUsuario } from "../api/usuarios";
import Loading from "../components/Loading";

const HistoricoEventos = () => {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [tipoFilter, setTipoFilter] = useState("");
    const [estadoFilter, setEstadoFilter] = useState("");
    const [privacidadFilter, setPrivacidadFilter] = useState("");
    const usuarioContext = useUsuario();

    useEffect(() => {
        const fetchEventos = async () => {
            setLoading(true);
            setError("");
            try {
                const rol = usuarioContext?.usuario?.rol;

                if (rol === "ADMIN") {
                    setEventos(await getEventos());
                } else if (rol === "PARTICIPANTE") {
                    setEventos(await getEventosUsuario());
                } else {
                    setEventos([]);
                }
            } catch (err) {
                console.error("Error fetching eventos:", err);
                setError("Error al obtener el historial de eventos.");
            } finally {
                setLoading(false);
            }
        };

        fetchEventos();
    }, [usuarioContext]);

    const calcularEstadoEvento = (evento: Evento) => {
        const ahora = new Date();
        const fechaEvento = parseFecha(evento.fecha);
        return fechaEvento < ahora ? "Pasado" : "Activo";
    };

    const handleDescargarReporte = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("Reporte de Eventos", 14, 18);
        doc.setFontSize(12);
        doc.text(`Generado el: ${new Date().toLocaleString()}`, 14, 26);

        const tableColumn = [
            "Nombre",
            "Tipo",
            "Fecha",
            "Organizador",
            "Empresa Patrocinadora",
            "Público",
            "Estado",
        ];
        const tableRows = eventos.map((evento) => [
            evento.nombre,
            evento.tipo,
            evento.fecha,
            evento.nombreOrganizador,
            evento.empresaPatrocinadora && evento.empresaPatrocinadora.nombre
                ? evento.empresaPatrocinadora.nombre
                : "Sin patrocinador",
            evento.publico ? "Sí" : "No",
            calcularEstadoEvento(evento),
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 32,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [33, 150, 243] },
        });

        doc.save("reporte_eventos.pdf");
    };

    const handleDescargarReporteEvento = (evento: Evento) => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(`Reporte del Evento: ${evento.nombre}`, 14, 18);
        doc.setFontSize(12);
        doc.text(`Generado el: ${new Date().toLocaleString()}`, 14, 26);

        const detalles = [
            ["Nombre", evento.nombre],
            ["Tipo", evento.tipo],
            ["Fecha", evento.fecha],
            ["Organizador", evento.nombreOrganizador],
            [
                "Empresa Patrocinadora",
                evento.empresaPatrocinadora &&
                evento.empresaPatrocinadora.nombre
                    ? evento.empresaPatrocinadora.nombre
                    : "Sin patrocinador",
            ],
            ["Público", evento.publico ? "Sí" : "No"],
            ["Estado", calcularEstadoEvento(evento)],
        ];
        autoTable(doc, {
            head: [["Campo", "Valor"]],
            body: detalles,
            startY: 32,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [33, 150, 243] },
        });

        // Solo mostrar participantes si el usuario NO es PARTICIPANTE
        const rol = usuarioContext?.usuario?.rol;
        if (rol !== "PARTICIPANTE") {
            const participantes = Array.isArray(evento.participantes)
                ? evento.participantes
                : [];
            const nextY = (doc as any).lastAutoTable?.finalY
                ? (doc as any).lastAutoTable.finalY + 8
                : 40;
            if (participantes.length > 0) {
                doc.setFontSize(14);
                doc.text("Participantes", 14, nextY);
                const participantesRows = participantes.map(
                    (p: any, idx: number) => [
                        idx + 1,
                        p.nombre || p.name || "",
                        p.username || p.usuario || p.email || "",
                    ]
                );
                autoTable(doc, {
                    head: [["#", "Nombre", "Usuario/Email"]],
                    body: participantesRows,
                    startY: nextY + 4,
                    styles: { fontSize: 10 },
                    headStyles: { fillColor: [76, 175, 80] },
                });
            } else {
                doc.setFontSize(12);
                doc.text(
                    "No hay participantes registrados para este evento.",
                    14,
                    nextY
                );
            }
        }

        doc.save(`reporte_evento_${evento.id}.pdf`);
    };

    const parseFecha = (fechaStr: string) => {
        if (!fechaStr) return new Date(0);

        if (fechaStr.includes(" ") && fechaStr.includes("-")) {
            const [datePart, timePart] = fechaStr.split(" ");
            const [day, month, year] = datePart.split("-");
            const [hours, minutes] = timePart.split(":");

            return new Date(
                parseInt(year),
                parseInt(month) - 1,
                parseInt(day),
                parseInt(hours),
                parseInt(minutes)
            );
        }

        // Fallback for other formats
        if (fechaStr.includes("T") || fechaStr.includes("/"))
            return new Date(fechaStr);

        const parts = fechaStr.split("-");
        if (parts.length === 3 && parts[2].length === 4) {
            return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        }

        if (parts.length === 3 && parts[0].length === 4) {
            return new Date(fechaStr);
        }
        return new Date(fechaStr);
    };

    // Filtrado igual que en Eventos
    const filteredEventos = eventos
        .filter((evento) => {
            const matchesSearch =
                evento.nombre
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                evento.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                evento.nombreOrganizador
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
            const matchesType = tipoFilter === "" || evento.tipo === tipoFilter;
            const estado = calcularEstadoEvento(evento);
            const matchesEstado =
                estadoFilter === "" || estado === estadoFilter;
            const matchesPrivacidad =
                privacidadFilter === "" ||
                (privacidadFilter === "publico" && evento.publico) ||
                (privacidadFilter === "privado" && !evento.publico);
            return (
                matchesSearch &&
                matchesType &&
                matchesEstado &&
                matchesPrivacidad
            );
        })
        .sort((a, b) => {
            const dateA = parseFecha(a.fecha);
            const dateB = parseFecha(b.fecha);
            return dateB.getTime() - dateA.getTime();
        });
    const uniqueTypes = [...new Set(eventos.map((evento) => evento.tipo))];

    if (loading) {
        return (
            <div className={"main-container"}>
                <Navbar />
                <div className={"eventos"}>
                    <h1>Histórico de Eventos</h1>
                    <Loading />
                </div>
            </div>
        );
    }

    return (
        <div className="main-container">
            <Navbar />
            <div className="eventos">
                <h1>Histórico de Eventos</h1>
                <div
                    style={{
                        display: "flex",
                        gap: 24,
                        alignItems: "center",
                        marginBottom: 32,
                        flexWrap: "wrap",
                    }}
                >
                    <button
                        className="button"
                        onClick={handleDescargarReporte}
                        style={{ height: 56, minWidth: 220, fontSize: 20 }}
                    >
                        <div className="button-wrapper">
                            <div className="text">Descargar reporte</div>
                            <span className="icon">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                    role="img"
                                    width="2.5em"
                                    height="2.5em"
                                    preserveAspectRatio="xMidYMid meet"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"
                                    />
                                </svg>
                            </span>
                        </div>
                    </button>
                    <div
                        className="search-container"
                        style={{
                            display: "flex",
                            gap: 18,
                            alignItems: "center",
                            background: "rgba(33, 150, 243, 0.08)",
                            borderRadius: 14,
                            padding: "18px 28px",
                            maxWidth: 1200,
                            minWidth: 600,
                            minHeight: 64,
                            width: "100%",
                        }}
                    >
                        <IoSearch size={28} style={{ color: "#b3e5fc" }} />
                        <input
                            type="text"
                            placeholder="Buscar eventos por nombre, tipo u organizador..."
                            value={searchTerm}
                            style={{
                                border: "none",
                                backgroundColor: "transparent",
                                color: "#fff",
                                fontSize: 16,
                                outline: "none",
                                width: "100%",
                                minWidth: 120,
                                height: 36,
                            }}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select
                            value={tipoFilter}
                            onChange={(e) => setTipoFilter(e.target.value)}
                            style={{
                                padding: "12px 22px",
                                borderRadius: "10px",
                                background: "#232323",
                                color: "#b3e5fc",
                                border: "1.5px solid #444",
                                fontSize: 18,
                            }}
                        >
                            <option value="">Todos los tipos</option>
                            {uniqueTypes.map((tipo) => (
                                <option key={tipo} value={tipo}>
                                    {tipo}
                                </option>
                            ))}
                        </select>
                        <select
                            value={estadoFilter}
                            onChange={(e) => setEstadoFilter(e.target.value)}
                            style={{
                                padding: "12px 22px",
                                borderRadius: "10px",
                                background: "#232323",
                                color: "#b3e5fc",
                                border: "1.5px solid #444",
                                fontSize: 18,
                            }}
                        >
                            <option value="">Todos los Estados</option>
                            <option value="Activo">Activo</option>
                            <option value="Pasado">Pasado</option>
                        </select>
                        <select
                            value={privacidadFilter}
                            onChange={(e) =>
                                setPrivacidadFilter(e.target.value)
                            }
                            style={{
                                padding: "12px 22px",
                                borderRadius: "10px",
                                background: "#232323",
                                color: "#b3e5fc",
                                border: "1.5px solid #444",
                                fontSize: 18,
                            }}
                        >
                            <option value="">Visibilidad</option>
                            <option value="publico">Público</option>
                            <option value="privado">Privado</option>
                        </select>
                    </div>
                </div>

                {loading && (
                    <p style={{ color: "#fff" }}>Cargando eventos...</p>
                )}

                {!loading && error ? (
                    <p style={{ color: "#ff5252" }}>{error}</p>
                ) : eventos.length === 0 ? (
                    <p style={{ color: "#fff" }}>
                        No hay eventos en el historial.
                    </p>
                ) : (
                    <>
                        <ul style={{ listStyle: "none", padding: 0 }}>
                            {filteredEventos.map((evento) => {
                                const estado = calcularEstadoEvento(evento);
                                return (
                                    <li
                                        key={evento.id}
                                        style={{
                                            background: "#333",
                                            margin: "16px 0",
                                            borderRadius: "8px",
                                            padding: "18px",
                                            boxShadow:
                                                "0 2px 8px rgba(0,0,0,0.25)",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: "10px",
                                                }}
                                            >
                                                <Link
                                                    to={`/eventos/${evento.id}`}
                                                    style={{
                                                        color: "#2196f3",
                                                        textDecoration:
                                                            "underline",
                                                        fontWeight: "bold",
                                                        fontSize: "1.25em",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    {evento.nombre}
                                                </Link>
                                                {evento.publico ? (
                                                    <MdPublic
                                                        size={30}
                                                        color="white"
                                                    />
                                                ) : (
                                                    <MdLock
                                                        size={30}
                                                        color="white"
                                                    />
                                                )}
                                            </div>
                                            <span
                                                style={{
                                                    padding: "4px 14px",
                                                    borderRadius: "12px",
                                                    color: "#fff",
                                                    background:
                                                        estado === "Activo"
                                                            ? "#43e97b"
                                                            : "#e53935",
                                                    fontWeight: "bold",
                                                    fontSize: "1em",
                                                    marginLeft: "16px",
                                                }}
                                            >
                                                {estado}
                                            </span>
                                        </div>
                                        <p
                                            style={{
                                                margin: "10px 0 0 0",
                                                color: "#fff",
                                            }}
                                        >
                                            <b style={{ color: "#ffffff" }}>
                                                Tipo:
                                            </b>{" "}
                                            <span style={{ color: "#b3e5fc" }}>
                                                {evento.tipo}
                                            </span>
                                        </p>
                                        <p
                                            style={{
                                                margin: "4px 0",
                                                color: "#fff",
                                            }}
                                        >
                                            <b style={{ color: "#ffffff" }}>
                                                Fecha:
                                            </b>{" "}
                                            <span style={{ color: "#b3e5fc" }}>
                                                {evento.fecha}
                                            </span>
                                        </p>
                                        <p
                                            style={{
                                                margin: "4px 0",
                                                color: "#fff",
                                            }}
                                        >
                                            <b style={{ color: "#ffffff" }}>
                                                Organizador:
                                            </b>{" "}
                                            <span style={{ color: "#b3e5fc" }}>
                                                {evento.nombreOrganizador}
                                            </span>
                                        </p>
                                        <p
                                            style={{
                                                margin: "4px 0",
                                                color: "#fff",
                                            }}
                                        >
                                            <b style={{ color: "#ffffff" }}>
                                                Empresa Patrocinadora:
                                            </b>{" "}
                                            <span style={{ color: "#b3e5fc" }}>
                                                {evento.empresaPatrocinadora &&
                                                evento.empresaPatrocinadora
                                                    .nombre
                                                    ? evento
                                                          .empresaPatrocinadora
                                                          .nombre
                                                    : "Sin patrocinador"}
                                            </span>
                                        </p>
                                        <button
                                            className="Btn"
                                            onClick={() =>
                                                handleDescargarReporteEvento(
                                                    evento
                                                )
                                            }
                                        >
                                            <svg
                                                className="svgIcon"
                                                viewBox="0 0 384 512"
                                                height="1em"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
                                            </svg>
                                            <span className="icon2" />
                                            <span className="tooltip">
                                                Descargar
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
};

export default HistoricoEventos;
