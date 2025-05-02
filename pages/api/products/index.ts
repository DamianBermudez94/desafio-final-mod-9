// pages/api/products/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { searchProducts } from "lib/controllers/products";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        // Extraemos parámetros de búsqueda y paginación
        const query = req.query.q?.toString() || "";
        const limit = parseInt(req.query.limit as string) || 10;  // Establecemos un límite de productos por página
        const offset = parseInt(req.query.offset as string) || 0; // Y el offset para la paginación

        // Llamamos a la función para obtener los productos con paginación
        const result = await searchProducts(query, limit, offset);

        // Respondemos con los productos filtrados y la información de paginación
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
}
