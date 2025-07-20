// types/auth.d.ts
import type { JwtPayload } from "jsonwebtoken";
import type { NextApiRequest } from "next";

export interface AuthTokenPayload extends JwtPayload {
    userId: string;
    email: string;
    isAdmin: boolean;
}

export interface AuthenticatedNextApiRequest extends NextApiRequest {
    user: AuthTokenPayload;
}

