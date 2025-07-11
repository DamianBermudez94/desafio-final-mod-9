// /pages/api/products/new.ts

/*import type { NextApiRequest, NextApiResponse } from "next";
import { saveProductToDB } from "../../../lib/controllers/products";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { nombre, precio, descripcion, imagen, tipo, color, enStock } =
    req.body;

  if (!nombre || !precio || !descripcion || !imagen) {
    return res.status(400).json({ error: "Faltan datos requeridos" });
  }

  try {
    const producto = await saveProductToDB({
      nombre,
      precio,
      descripcion,
      imagen,
      tipo,
      color,
      enStock,
    });

    return res.status(201).json({ message: "Producto guardado", producto });
  } catch (error: any) {
    console.error("Error al guardar producto:", error.message);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}*/

import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../../lib/mongoose";
import { Producto } from "../../../lib/models/products";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectDB();

    const { nombre, precio, descripcion, imagen, tipo, color, enStock } =
      req.body;

    if (!nombre || !precio || !descripcion || !imagen) {
      return res
        .status(400)
        .json({ ok: false, error: "Faltan campos obligatorios" });
    }

    const nuevoProducto = new Producto({
      nombre,
      precio,
      descripcion,
      imagen,
      tipo,
      color,
      enStock,
    });

    const productoGuardado = await nuevoProducto.save();

    res.status(201).json({ ok: true, producto: productoGuardado });
  } catch (error: any) {
    console.error("Error guardando producto:", error.message);
    res.status(500).json({ ok: false, error: "Error guardando producto" });
  }
}
