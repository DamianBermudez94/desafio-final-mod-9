import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../../lib/mongoose";
import { Producto } from "../../../lib/models/products";

export default async function getProduct(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        await connectDB();
        const productos = await Producto.find();

        return res.status(200).json({ ok: true, productos }); // << ESTA ES LA RESPUESTA

    } catch (err) {
        console.error("Error buscando productos:", err);
        return res
            .status(500)
            .json({ ok: false, error: "Error interno del servidor" });
    }
}

