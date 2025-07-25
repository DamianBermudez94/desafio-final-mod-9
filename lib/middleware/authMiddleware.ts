// lib/middlewares/authMiddleware.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { AuthenticatedNextApiRequest, AuthTokenPayload } from "../../types/auth";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET; // Asegurate de tenerlo en .env

export async function adminAuth(
  req: AuthenticatedNextApiRequest,
  res: NextApiResponse,
  next: Function
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET) as AuthTokenPayload;

    if (!decoded.isAdmin) {
      return res.status(403).json({ message: "Acceso denegado: no sos admin" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}