function Confirmation({
    onConfirm,
    onCancel,
    title,
    message,
    confirmText,
}: {
    onConfirm: () => void;
    onCancel: () => void;
    title: string;
    message?: string;
    confirmText: string;
}) {
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "5px",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                    maxWidth: "400px",
                    width: "100%",
                }}
            >
                <h3 style={{ marginTop: 0 }}>{title}</h3>
                <p>{message}</p>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "10px",
                        marginTop: "20px",
                    }}
                >
                    <button
                        onClick={onCancel}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: "#ccc",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: "#f44336",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Confirmation;
