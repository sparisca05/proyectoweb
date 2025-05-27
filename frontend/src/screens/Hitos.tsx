import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar.tsx";
import { IoIosAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useUsuario } from "../contexts/UsuarioContext.tsx";
import { getHitos } from "../api/hitos.ts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface Hito {
    id: number;
    nombre: string;
    categoria: string;
    eventoRelevante: {
        id: number;
        nombre: string;
    };
    ganadores: {
        id: number;
        username: string;
        nombre: string;
        apellido: string;
    }[];
}

const Hitos: React.FC = () => {
    const [hitos, setHitos] = useState<Hito[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState("");
    const usuario = useUsuario();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchHitos = async () => {
            try {
                setLoading(true);
                const hitos = await getHitos();
                setHitos(hitos);
                setError("");
            } catch (error) {
                console.error("Error fetching hitos:", error);
                setError("Error: " + error);
            } finally {
                setLoading(false);
            }
        };
        fetchHitos();
    }, [usuario]);

    // Generar PDF de todos los hitos
    const handleDescargarReporteHitos = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("Reporte de Hitos", 14, 18);
        doc.setFontSize(12);
        doc.text(`Generado el: ${new Date().toLocaleString()}`, 14, 26);

        // Tabla principal de hitos
        autoTable(doc, {
            head: [["Nombre", "Categoría", "Evento Relevante", "Ganadores"]],
            body: hitos.map((hito) => [
                hito.nombre,
                hito.categoria,
                hito.eventoRelevante?.nombre || "-",
                hito.ganadores.length > 0
                    ? hito.ganadores.map(g => `${g.nombre} ${g.apellido} (${g.username})`).join(", ")
                    : "Sin ganadores"
            ]),
            startY: 32,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [33, 150, 243] },
        });

        let nextY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 10 : 40;
        doc.setFontSize(14);
        doc.text("Detalle de Ganadores por Hito", 14, nextY);
        doc.setFontSize(11);
        nextY += 6;
        hitos.forEach((hito, idx) => {
            doc.text(`${idx + 1}. ${hito.nombre} (${hito.categoria})`, 14, nextY);
            nextY += 6;
            if (hito.ganadores.length > 0) {
                autoTable(doc, {
                    head: [["Nombre", "Apellido", "Username"]],
                    body: hito.ganadores.map(g => [g.nombre, g.apellido, g.username]),
                    startY: nextY,
                    styles: { fontSize: 9 },
                    headStyles: { fillColor: [76, 175, 80] },
                    margin: { left: 18 },
                });
                nextY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 8 : nextY + 12;
            } else {
                doc.text("Sin ganadores", 22, nextY);
                nextY += 8;
            }
        });

        doc.save("reporte_hitos.pdf");
    };

    if (loading) {
        return (
            <div className={"main-container"}>
                <Navbar />
                <div className={"eventos"}>
                    <h4 style={{ textAlign: "center", color: "white" }}>
                        Cargando hitos...
                    </h4>
                </div>
            </div>
        );
    }

    return (
        <div className={"main-container"}>
            <Navbar />
            <div className={"eventos"}>
                <h1>Hitos</h1>
                <button
                    onClick={handleDescargarReporteHitos}
                    style={{
                        marginBottom: "18px",
                        padding: "8px 18px",
                        background: "#43e97b",
                        color: "#222",
                        border: "none",
                        borderRadius: "6px",
                        fontWeight: "bold",
                        fontSize: "0.95em",
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                        transition: "background 0.2s",
                    }}
                >
                    Descargar reporte
                </button>
                <table className="custom-table">
                    {error && (
                        <div style={{ textAlign: "center", color: "white" }}>
                            {error}
                        </div>
                    )}
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Evento Relevante</th>
                            <th>Ganador</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hitos &&
                            hitos.map((hito) => (
                                <tr key={hito.id}>
                                    <td>{hito.nombre}</td>
                                    <td>{hito.categoria}</td>
                                    <td>{hito.eventoRelevante.nombre}</td>
                                    <td>
                                        {hito.ganadores.length > 0 ? (
                                            hito.ganadores.map((ganador) => (
                                                <div key={ganador.id}>
                                                    {ganador.nombre}{" "}
                                                    {ganador.apellido}
                                                </div>
                                            ))
                                        ) : (
                                            <div>No hay ganadores</div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
                {usuario && usuario.usuario?.rol === "ADMIN" && (
                    <div className="add">
                        <IoIosAdd
                            className="add-icon"
                            onClick={() => navigate("/hitos/nuevo-hito")}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Hitos;
