import { useState } from "react";
import { API_URL } from "../main";
import { getToken } from "../screens/Home";
import { IoMdClose } from "react-icons/io";

function PasskeyInput({
    evento,
    setDisplayPasskey,
}: {
    evento: any;
    setDisplayPasskey: any;
}) {
    const token = getToken();
    const [passkey, setPasskey] = useState("");

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!token) {
            alert("Debes iniciar sesión para inscribirte en un evento.");
            return;
        }
        if (!passkey) {
            alert("Por favor, ingresa la clave.");
            return;
        }
        await fetch(
            `${API_URL}/api/v1/eventos/${evento.id}/agregar-participante`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer " + localStorage.getItem("authToken"),
                },
                body: passkey,
            }
        )
            .then((response) => response.text())
            .then((message) => {
                alert(message);
                if (
                    message !=
                    "La clave ingersada es incorrecta, intente de nuevo."
                )
                    window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className="clave-input">
            <div>
                <IoMdClose
                    className="back-btn mb-3"
                    onClick={() => setDisplayPasskey(false)}
                />
                <form onSubmit={handleSubmit}>
                    <label className="form-label">
                        Ingresa la clave labelara participar en el evento:
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        value={passkey}
                        onChange={(e) => setPasskey(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn btn-secondary">
                        Enviar
                    </button>
                </form>
            </div>
        </div>
    );
}

export default PasskeyInput;
