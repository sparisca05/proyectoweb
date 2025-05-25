import { useState } from "react";
import { API_URL } from "../main";
import { getToken } from "../screens/Home";
import { IoMdClose } from "react-icons/io";

function PasskeyInput({
    evento,
    setDisplayInvitado,
}: {
    evento: any;
    setDisplayInvitado: any;
}) {
    const [name, setName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        await fetch(`${API_URL}/api/v1/invitados-externos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + getToken(),
            },
            body: JSON.stringify({
                nombre: name,
                apellido: lastName,
                descripcionRol: description,
            }),
        })
            .then((response) => response.text())
            .then(async () => {
                await fetch(
                    `${API_URL}/api/v1/eventos/${evento.id}/agregar-invitado`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + getToken(),
                        },
                        body: name,
                    }
                )
                    .then((response) => response.text())
                    .then((message) => {
                        alert(message);
                        window.location.reload();
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            });
    };

    return (
        <div className="clave-input">
            <div>
                <IoMdClose
                    className="back-btn mb-3"
                    onClick={() => setDisplayInvitado(false)}
                />
                <h4>Añadir un invitado externo</h4>
                <form onSubmit={handleSubmit}>
                    <label className="form-label" htmlFor="name">
                        Nombre
                    </label>
                    <input
                        className="mb-3 form-control"
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <label className="form-label" htmlFor="lastName">
                        Apellido
                    </label>
                    <input
                        className="mb-3 form-control"
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                    <label className="form-label" htmlFor="role">
                        Descripción del rol
                    </label>
                    <input
                        className="mb-3 form-control"
                        id="role"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn submit-button">
                        Guardar
                    </button>
                </form>
            </div>
        </div>
    );
}

export default PasskeyInput;
