import { redirect } from "next/navigation";

export default function CreatePostRoute() {
  // `/admin` already contains the create form.
  redirect("/admin");
}

