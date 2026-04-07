import { logoutResponse } from "@/lib/auth-cookie";

/** Clears session cookies; same effect as POST /api/auth/logout. */
export async function POST() {
  return logoutResponse();
}
