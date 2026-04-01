import { prisma } from "@/lib/prisma";

/** Email listed in ADMIN_EMAIL receives ADMIN on registration (configure in .env). */
export function roleForNewUser(email: string): "ADMIN" | "USER" {
  const admin = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  if (admin && email.trim().toLowerCase() === admin) {
    return "ADMIN";
  }
  return "USER";
}

/** If ADMIN_EMAIL matches but the row is still USER (e.g. signed up before env was set), promote in DB. */
export async function syncAdminRoleFromEnv(user: {
  id: string;
  email: string;
  name: string;
  role: string;
}): Promise<{ id: string; email: string; name: string; role: string }> {
  if (roleForNewUser(user.email) !== "ADMIN" || user.role === "ADMIN") {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
  return prisma.user.update({
    where: { id: user.id },
    data: { role: "ADMIN" },
    select: { id: true, email: true, name: true, role: true },
  });
}
