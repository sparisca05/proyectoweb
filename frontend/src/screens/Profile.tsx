import Navbar from "../components/Navbar.tsx";
import UserInfo from "../components/UserInfo.tsx";
import MisEventos from "../components/MisEventos.tsx";
import { getToken } from "./Home.tsx";

function Profile() {
    const token = getToken();
    if (!token) {
        window.location.href = "/login";
    }
    return (
        <div className={"main-container"}>
            <Navbar />
            <div className={"welcome"}>
                <div className={"profile-container"}>
                    <div className={"content-container user-info"}>
                        <UserInfo />
                    </div>
                    <div
                        className={"content-container eventos"}
                        style={{ flex: 1 }}
                    >
                        <MisEventos />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
