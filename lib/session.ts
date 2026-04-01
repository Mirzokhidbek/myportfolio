import { cookies } from "next/headers";
import { AUTH_COOKIE, verifyAuthToken, type JwtUserPayload } from "@/lib/auth-token";

export async function getSession(): Promise<JwtUserPayload | null> {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  return verifyAuthToken(token);
}

export async function requireUser(): Promise<JwtUserPayload | null> {
  return getSession();
}

export async function requireAdmin(): Promise<JwtUserPayload | null> {
  const s = await getSession();
  if (!s || s.role !== "ADMIN") return null;
  return s;
}
