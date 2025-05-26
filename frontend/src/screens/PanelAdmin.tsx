import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.tsx";
import { getToken } from "./Home.tsx";
import "../App.css";
import PanelUsuarios from "./PanelUsuarios.tsx";
import PanelStats from "./PanelStats.tsx";
import { getEventos, getEventosActivos } from "../api/eventos.ts";
import { getUsuarios } from "../api/usuarios.ts";
import { Usuario } from "../contexts/UsuarioContext.tsx";
import { getHitos } from "../api/hitos.ts";
import { Evento } from "./Eventos.tsx";

const AdminPanel: React.FC = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [activeTab, setActiveTab] = useState<"stats" | "usuarios">("stats");
    const [loading, setLoading] = useState<boolean>(true);
    const [stats, setStats] = useState({
        totalUsuarios: 0,
        totalEventos: 0,
        totalHitos: 0,
        eventosActivos: 0,
    });

    const token = getToken();
    if (!token) {
        window.location.href = "/login";
    }

    // Cargar estadísticas al montar el componente
    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);

                const usuarios = await getUsuarios(token || "");
                setUsuarios(usuarios);
                const eventos = await getEventos();
                setEventos(eventos);
                const hitos = await getHitos();
                const eventosActivos = await getEventosActivos();

                setStats({
                    totalUsuarios: usuarios?.length || 0,
                    totalEventos: eventos?.length || 0,
                    totalHitos: hitos?.length || 0,
                    eventosActivos: eventosActivos?.length || 0,
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const renderActiveComponent = () => {
        switch (activeTab) {
            case "usuarios":
                return <PanelUsuarios usuarios={usuarios} loading={loading} />;
            case "stats":
                return (
                    <PanelStats
                        stats={stats}
                        eventos={eventos}
                        loading={loading}
                    />
                );
            default:
                return (
                    <PanelStats
                        stats={stats}
                        eventos={eventos}
                        loading={loading}
                    />
                );
        }
    };

    return (
        <div className="main-container">
            <Navbar />
            <div className="admin-panel-container">
                <nav className="admin-submenu">
                    <button
                        className={`submenu-btn ${
                            activeTab === "stats" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("stats")}
                    >
                        📊 Estadísticas
                    </button>
                    <button
                        className={`submenu-btn ${
                            activeTab === "usuarios" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("usuarios")}
                    >
                        👥 Usuarios
                    </button>
                </nav>

                {/* Contenido del componente activo */}
                <div className="admin-content">{renderActiveComponent()}</div>
            </div>
        </div>
    );
};

export default AdminPanel;
