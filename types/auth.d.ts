// types/auth.d.ts
import type { NextApiRequest } from "next";

export interface AuthenticatedNextApiRequest extends NextApiRequest {
    user: {
        userId: string;
        email?: string;
        role?: string;
    };
}
