import { useEffect, useState } from "react";
import { API_URL } from "../main";
import { getToken } from "../screens/Home";

export interface ComentarioEvento {
    id: number;
    contenido: string;
    fechaCreacion: string;
    usuarioId?: number;
    usuarioNombre?: string;
}

export function useComentariosEvento(eventoId: number) {
    const [comentarios, setComentarios] = useState<ComentarioEvento[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchComentarios() {
            setLoading(true);
            try {
                const res = await fetch(`${API_URL}/api/v1/comentarios/${eventoId}`);
                if (res.ok) {
                    setComentarios(await res.json());
                } else {
                    setError("Error al cargar comentarios");
                }
            } catch (e) {
                setError("Error de conexión");
            } finally {
                setLoading(false);
            }
        }
        if (eventoId) fetchComentarios();
    }, [eventoId]);

    return { comentarios, loading, error, setComentarios };
}

export async function agregarComentarioEvento(eventoId: number, contenido: string) {
    const res = await fetch(`${API_URL}/api/v1/comentarios/${eventoId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getToken(),
        },
        body: JSON.stringify({ contenido }),
    });
    if (!res.ok) throw new Error("No se pudo agregar el comentario");
    return await res.json();
}
