import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../../lib/mongoose";
import { Producto } from "../../../lib/models/products";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await connectDB();

    const { id } = req.query;

    if (typeof id !== "string") {
        return res.status(400).json({ ok: false, error: "ID inválido" });
    }

    try {
        if (req.method === "PUT") {
            const updatedProduct = await Producto.findByIdAndUpdate(id, req.body, {
                new: true,
                runValidators: true,
            });

            if (!updatedProduct) {
                return res.status(404).json({ ok: false, error: "Producto no encontrado" });
            }

            return res.status(200).json({ ok: true, producto: updatedProduct });
        }

        if (req.method === "DELETE") {
            const deleted = await Producto.findByIdAndDelete(id);

            if (!deleted) {
                return res.status(404).json({ ok: false, error: "Producto no encontrado" });
            }

            return res.status(200).json({ ok: true, mensaje: "Producto eliminado" });
        }

        return res.status(405).json({ error: "Método no permitido" });
    } catch (error) {
        console.error("Error en PUT/DELETE:", error);
        return res.status(500).json({ ok: false, error: "Error interno del servidor" });
    }
}
