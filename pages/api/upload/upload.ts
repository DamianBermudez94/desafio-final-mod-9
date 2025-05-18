import type { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import { processUpload } from "../../../lib/controllers/uploadController";

const upload = multer({ storage: multer.memoryStorage() });

export const config = {
    api: {
        bodyParser: false,
    },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: `Método ${req.method} no permitido` });
    }

    upload.single("file")(req as any, res as any, async (err: any) => {
        if (err) {
            console.error("Error multer:", err);
            return res.status(500).json({ error: err.message || "Error en multer" });
        }

        if (!req.file) {
            return res.status(400).json({ error: "No se recibió archivo" });
        }

        try {
            const imageUrl = await processUpload(req.file);
            console.log("✅ Imagen subida a Bunny:", imageUrl);
            return res.status(200).json({ url: imageUrl });
        } catch (error: any) {
            console.error("Error en controlador de upload:", error);
            return res.status(500).json({ error: "Error subiendo la imagen" });
        }
    });
}



