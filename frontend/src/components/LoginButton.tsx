import { Link } from "react-router-dom";

const LoginButton = ({ submit }: { submit: boolean }) => {
    return (
        <>
            {submit ? (
                <button type="submit" className={"btn submit-button"}>
                    Iniciar sesión
                </button>
            ) : (
                <Link to="/login" className={"btn submit-button outline"}>
                    Iniciar sesión
                </Link>
            )}
        </>
    );
};

export default LoginButton;
