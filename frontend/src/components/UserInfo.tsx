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
                                {user.usuario?.nombre} {user.usuario?.apellido}
                            </p>
                            <p>{user.usuario?.username}</p>
                        </div>
                        <p>Rol: {user.usuario?.rol}</p>
                    </div>
                ) : (
                    <p>No se encontraron datos del usuario.</p>
                )}
            </div>
        </>
    );
};

export default UserInfo;
