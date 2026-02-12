import { createRemoteJWKSet,jwtVerify } from "jose";

const SUPABASE_PROJECT_URL = process.env.SUPABASE_URL;

const JWKS = createRemoteJWKSet(
  new URL(`${SUPABASE_PROJECT_URL}/auth/v1/.well-known/jwks.json`)
);

export const verifySupabaseToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Missing auth token" });
        }

        const token = authHeader.split(" ")[1];

        const { payload } = await jwtVerify(token, JWKS);

        req.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role
        };

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}