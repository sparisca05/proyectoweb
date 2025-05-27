import axios from "axios";
import { useState } from "react";
import { API_URL } from "../main";
import { getToken } from "../screens/Home";

export const ImageUpload: React.FC<{
    onImageUpload: (url: string) => void;
    endpoint: string;
}> = ({ onImageUpload, endpoint }) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string>("");

    const handleFileSelect = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Preview local
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);

        // Upload a Cloudinary
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("imagen", file);

            const response = await axios.post(
                `${API_URL}/api/v1/upload/${endpoint}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            onImageUpload(response.data.url);
        } catch (error) {
            console.error("Error uploading image:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={uploading}
            />
            {uploading && <p>Subiendo imagen...</p>}
            {preview && (
                <img
                    src={preview}
                    alt="Preview"
                    style={{
                        width: "200px",
                        height: "200px",
                        objectFit: "cover",
                    }}
                />
            )}
        </div>
    );
};
