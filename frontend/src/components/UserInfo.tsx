import { useUsuario } from "../contexts/UsuarioContext";

const UserInfo = () => {
    const user = useUsuario();

    return (
        <>
            <h2>Perfil</h2>
            <div>
                {user ? (
                    <div>
                        <div className={"name"}>
                            <p style={{ fontWeight: "bold", fontSize: "28px" }}>
                                {user.nombre} {user.apellido}
                            </p>
                            <p>{user.username}</p>
                        </div>
                        <p>Rol: {user.rol}</p>
                    </div>
                ) : (
                    <p>No se encontraron datos del usuario.</p>
                )}
            </div>
        </>
    );
};

export default UserInfo;
