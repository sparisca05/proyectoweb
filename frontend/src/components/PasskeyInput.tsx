import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { addPrivateEventParticipant } from "../api/eventos";

function PasskeyInput({
    evento,
    setDisplayPasskey,
}: {
    evento: any;
    setDisplayPasskey: any;
}) {
    const [passkey, setPasskey] = useState("");

    const handleSubmit = async () => {
        try {
            const message = await addPrivateEventParticipant(
                evento.id,
                passkey
            );
            alert(message);
            setDisplayPasskey(false);
        } catch (error) {
            console.error("Error al agregar participante:", error);
            alert("Error al agregar participante: " + error);
        }
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
                        Ingresa la clave para participar en el evento:
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
