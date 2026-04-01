import fs from "fs/promises";
import path from "path";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

async function main() {
  const titleArg = process.argv.slice(2).join(" ").trim();
  const title = titleArg || "New Daily Post";

  const date = formatDate(new Date());
  const slug = `${date}-${slugify(title) || "daily-note"}`;

  const blogDir = path.join(process.cwd(), "content", "blog");
  const filePath = path.join(blogDir, `${slug}.md`);

  const template = `---
title: "${title}"
author: "Your Name"
date: "${date}"
tags: ["daily", "notes"]
excerpt: "Write a one-line summary for this post."
---

## Today

Write what you learned or built today.

## Notes

- Point 1
- Point 2
`;

  await fs.mkdir(blogDir, { recursive: true });

  try {
    await fs.access(filePath);
    console.error(`Post already exists: ${filePath}`);
    process.exit(1);
  } catch {
    await fs.writeFile(filePath, template, "utf8");
    console.log(`Created: ${filePath}`);
    console.log(`URL: /blog/${slug}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

