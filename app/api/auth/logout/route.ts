import { logoutResponse } from "@/lib/auth-cookie";

export async function POST() {
  return logoutResponse();
}
