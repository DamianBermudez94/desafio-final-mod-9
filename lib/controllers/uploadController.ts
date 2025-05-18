import axios from "axios";

const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE!;
const BUNNY_API_KEY = process.env.BUNNY_API_KEY!;
const BUNNY_PUBLIC_URL = process.env.BUNNY_PUBLIC_URL!;
const BUNNY_BASE_URL = `https://storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}`;

export async function processUpload(file: Express.Multer.File): Promise<string> {
    const fileName = `${Date.now()}-${file.originalname}`;

    try {
        await axios.put(`${BUNNY_BASE_URL}/${fileName}`, file.buffer, {
            headers: {
                AccessKey: BUNNY_API_KEY,
                "Content-Type": file.mimetype,
            },
        });
    } catch (error: any) {
        console.error("❌ Error en subida a Bunny:", error.response?.data || error.message);
        throw new Error("Error en subida a Bunny: " + (error.response?.data || error.message));
    }

    return `${BUNNY_PUBLIC_URL}/${fileName}`;
}



