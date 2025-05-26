import { Evento } from "./Eventos";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

function PanelStats({
    stats,
    eventos,
    loading,
}: {
    stats: any;
    eventos: Evento[];
    loading?: boolean;
}) {
    const tiposEvento = [
        "Conferencia",
        "Seminario",
        "Taller",
        "Hackathon",
        "Networking",
        "Capacitación",
        "Feria",
        "Presentación",
    ];

    const contarEventosPorTipo = () => {
        const conteo: { [key: string]: number } = {};

        // Initialize all types with 0
        tiposEvento.forEach((tipo) => {
            conteo[tipo] = 0;
        });

        // Count events by type
        eventos.forEach((evento) => {
            if (evento.tipo && conteo.hasOwnProperty(evento.tipo)) {
                conteo[evento.tipo]++;
            } else if (evento.tipo) {
                // Handle custom types that aren't in the predefined list
                conteo[evento.tipo] = (conteo[evento.tipo] || 0) + 1;
            }
        });

        return conteo;
    };

    const contarParticipantesPorEvento = () => {
        const conteo: { [key: string]: number } = {};
        eventos.forEach((evento) => {
            if (evento.tipo) {
                conteo[evento.tipo] =
                    (conteo[evento.tipo] || 0) + evento.participantes.length;
            }
        });
        return conteo;
    };

    const eventosConteo = contarEventosPorTipo();
    const participantesConteo = contarParticipantesPorEvento();
    const totalParticipantes = Object.values(participantesConteo).reduce(
        (acc, count) => acc + count,
        0
    );

    // Filter out event types with 0 count
    const filteredEventos = Object.entries(eventosConteo).filter(
        ([, count]) => count > 0
    );
    const filteredLabels = filteredEventos.map(([tipo]) => tipo);
    const filteredData = filteredEventos.map(([, count]) => count);

    // Filter out event types with 0 participants
    const filteredParticipantes = Object.entries(participantesConteo).filter(
        ([, count]) => count > 0
    );
    const filteredParticipantesLabels = filteredParticipantes.map(
        ([tipo]) => tipo
    );
    const filteredParticipantesData = filteredParticipantes.map(
        ([, count]) => count
    );

    const chartData = {
        labels: filteredLabels,
        datasets: [
            {
                label: "Número de Eventos",
                data: filteredData,
                backgroundColor: [
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(255, 205, 86, 0.6)",
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(153, 102, 255, 0.6)",
                    "rgba(255, 159, 64, 0.6)",
                    "rgba(199, 199, 199, 0.6)",
                    "rgba(83, 102, 255, 0.6)",
                ].slice(0, filteredData.length),
                borderColor: [
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 99, 132, 1)",
                    "rgba(255, 205, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 159, 64, 1)",
                    "rgba(199, 199, 199, 1)",
                    "rgba(83, 102, 255, 1)",
                ].slice(0, filteredData.length),
                borderWidth: 1,
            },
        ],
    };

    const participantesChartData = {
        labels: filteredParticipantesLabels,
        datasets: [
            {
                label: "Número de Participantes",
                data: filteredParticipantesData,
                backgroundColor: [
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(255, 159, 64, 0.6)",
                    "rgba(153, 102, 255, 0.6)",
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 205, 86, 0.6)",
                    "rgba(199, 199, 199, 0.6)",
                    "rgba(83, 102, 255, 0.6)",
                ].slice(0, filteredParticipantesData.length),
                borderColor: [
                    "rgba(75, 192, 192, 1)",
                    "rgba(255, 159, 64, 1)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 205, 86, 1)",
                    "rgba(199, 199, 199, 1)",
                    "rgba(83, 102, 255, 1)",
                ].slice(0, filteredParticipantesData.length),
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "Eventos por Tipo",
                font: {
                    size: 20,
                },
                color: "#fff",
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        return `${context.label}: ${context.parsed.y} eventos`;
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
            },
        },
    };

    const participantesChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "Participantes por Tipo de Evento",
                font: {
                    size: 20,
                },
                color: "#fff",
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        return `${context.label}: ${context.parsed} participantes`;
                    },
                },
            },
        },
    };

    if (loading) {
        return <h3>Cargando estadísticas...</h3>;
    }
    return (
        <div>
            <h1>Panel de Estadísticas</h1>
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                        <h4>Total Usuarios</h4>
                        <p className="stat-number">{stats.totalUsuarios}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">📅</div>
                    <div className="stat-info">
                        <h4>Total Eventos</h4>
                        <p className="stat-number">{stats.totalEventos}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🏆</div>
                    <div className="stat-info">
                        <h4>Total Hitos</h4>
                        <p className="stat-number">{stats.totalHitos}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🔥</div>
                    <div className="stat-info">
                        <h4>Eventos Activos</h4>
                        <p className="stat-number">{stats.eventosActivos}</p>
                    </div>
                </div>
            </div>

            <div className="stats-charts">
                <div
                    className="chart-container"
                    style={{
                        height: "400px",
                        width: "100%",
                        maxWidth: "800px",
                        margin: "0 auto 40px auto",
                    }}
                >
                    <Bar data={chartData} options={chartOptions} />
                </div>
                <div
                    className="chart-container"
                    style={{
                        height: "400px",
                        width: "100%",
                        maxWidth: "800px",
                        margin: "0 auto",
                    }}
                >
                    <Doughnut
                        data={participantesChartData}
                        options={participantesChartOptions}
                    />
                    <h4>
                        Total de usuarios participantes: {totalParticipantes}
                    </h4>
                </div>
            </div>
        </div>
    );
}

export default PanelStats;
