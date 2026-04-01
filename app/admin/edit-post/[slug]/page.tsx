import { redirect } from "next/navigation";

export default function EditPostRoute({
  params,
}: {
  params: { slug: string };
}) {
  redirect(`/admin?edit=${encodeURIComponent(params.slug)}`);
}

