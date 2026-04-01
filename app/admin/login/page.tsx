import { redirect } from "next/navigation";

export default function AdminLoginPage() {
  redirect("/auth/signin?next=/admin");
}
