import type { AuthTokenPayload } from "./auth";

declare module "next" {
    interface NextApiRequest {
        user?: AuthTokenPayload;
    }
}