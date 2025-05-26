import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import EventosList from "./screens/Eventos.tsx";
import Profile from "./screens/Profile.tsx";
import Home from "./screens/Home.tsx";
import Login from "./screens/Login.tsx";
import Register from "./screens/Register.tsx";
import EventoView from "./screens/EventoView.tsx";
import NuevoEvento from "./screens/NuevoEvento.tsx";
import NuevaEmpresa from "./screens/NuevaEmpresa.tsx";
import Hitos from "./screens/Hitos.tsx";
import EmpresaView from "./screens/empresaview.tsx";
import NuevoHito from "./screens/NuevoHito.tsx";
import PanelAdmin from "./screens/PanelAdmin.tsx";
import HistoricoEventos from "./screens/HistoricoEventos.tsx";
import { UsuarioProvider } from "./contexts/UsuarioContext.tsx";

export const API_URL = import.meta.env.VITE_API_URL;

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    //Se añaden aca afuera si se quiere que queden fuera del root
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/eventos", element: <EventosList /> },
    { path: "/eventos/:id", element: <EventoView /> },
    { path: "/eventos/nuevo-evento", element: <NuevoEvento /> },
    { path: "nueva-empresa", element: <NuevaEmpresa /> },
    { path: "/perfil", element: <Profile /> },
    { path: "/historico-eventos", element: <HistoricoEventos /> },
    { path: "/hitos", element: <Hitos /> },
    { path: "/hitos/nuevo-hito", element: <NuevoHito /> },
    { path: "/PanelAdmin", element: <PanelAdmin /> },
    { path: "/empresas", element: <EmpresaView /> },
]);

const App = ({ router }: { router: any }) => {
    /*
    useEffect(() => {
        const navigate = useNavigate();
        const token = getToken();
        if (!token) {
            handleLogout(navigate);
        }
    }, []);
*/
    return <RouterProvider router={router} />;
};

createRoot(document.getElementById("root")!).render(
    <UsuarioProvider>
        <App router={router} />
    </UsuarioProvider>
);
