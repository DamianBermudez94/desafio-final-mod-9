// lib/middlewares/authMiddleware.ts
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";


const SECRET = process.env.JWT_SECRET; // Asegurate de tenerlo en .env

export async function adminAuth(req: NextApiRequest, res: NextApiResponse, next: Function) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded: any = jwt.verify(token, SECRET);

        if (!decoded.isAdmin) {
            return res.status(403).json({ message: "Acceso denegado: no sos admin" });
        }

        // Lo agregamos al request para que lo use el endpoint si lo necesita
        req.user = decoded;

        next(); // Todo OK, seguimos
    } catch (err) {
        return res.status(401).json({ message: "Token inválido o expirado" });
    }
}
