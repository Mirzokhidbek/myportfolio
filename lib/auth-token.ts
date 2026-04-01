import * as jose from "jose";

export const AUTH_COOKIE = "auth_token";

export type JwtUserPayload = {
  sub: string;
  email: string;
  name: string;
  role: "ADMIN" | "USER";
};

function getSecretKey() {
  const s = process.env.AUTH_JWT_SECRET ?? "";
  if (s.length < 16) {
    throw new Error("AUTH_JWT_SECRET must be set to a string at least 16 characters.");
  }
  return new TextEncoder().encode(s);
}

export async function signAuthToken(payload: JwtUserPayload) {
  return new jose.SignJWT({
    email: payload.email,
    name: payload.name,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

export async function verifyAuthToken(token: string): Promise<JwtUserPayload | null> {
  try {
    const { payload } = await jose.jwtVerify(token, getSecretKey());
    const sub = payload.sub;
    const email = String(payload.email ?? "");
    const name = String(payload.name ?? "");
    if (!sub || !email) return null;
    const role = payload.role === "ADMIN" ? "ADMIN" : "USER";
    return { sub, email, name, role };
  } catch {
    return null;
  }
}
