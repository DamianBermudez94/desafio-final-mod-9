// /pages/api/products/new.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { saveProductToDB } from "../../../lib/controllers/products";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { nombre, precio, descripcion, imagen } = req.body;

  if (!nombre || !precio || !descripcion || !imagen) {
    return res.status(400).json({ error: "Faltan datos requeridos" });
  }

  try {
    const nuevoProducto = await saveProductToDB({
      nombre,
      precio,
      descripcion,
      imagen,
    });
    return res
      .status(201)
      .json({ message: "Producto guardado", producto: nuevoProducto });
  } catch (error: any) {
    console.error("Error al guardar producto:", error.message);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
