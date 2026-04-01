This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Daily Blog Posts (Markdown)

Your blog is generated from Markdown files in `content/blog/`.

To add a new post, create a new file like `content/blog/2026-03-31-my-post.md` with frontmatter:

```md
---
title: "My Post Title"
date: "2026-03-31"
tags: ["design", "updates"]
excerpt: "Short summary shown on the blog list."
---

Write your content in Markdown below.
```

After you save, your new post automatically appears on `/blog` and opens at `/blog/[slug]`.

## Blog Admin Panel

You can manage posts from UI at `/admin`:

- Create blog posts
- Edit existing posts
- Delete posts
- Set category and cover image
- Changes appear immediately on `/blog`

### Admin Login Setup (required)

Create `.env.local` with:

```bash
DATABASE_URL="file:./data/app.db"
ADMIN_EMAIL=your@email.com
ADMIN_PASSWORD=your_strong_password
ADMIN_SESSION_SECRET=your_long_random_secret
```

- Open `/admin/login` and sign in with your credentials.
- Only logged-in sessions can access `/admin` and publish posts.

> In production, do not commit `.env.local`. Instead set `DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` in your host provider's environment settings.

## Engagement Features

Each blog post supports:

- Comments (`/api/posts/[slug]/comments`)
- View counter (`/api/posts/[slug]/engagement`, action: `view`)
- Like button (`/api/posts/[slug]/engagement`, action: `like`)
- Share actions on the post page

## Cloudinary Setup (required for images)

Add these to `.env.local`:

```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
# optional
CLOUDINARY_UPLOAD_FOLDER=blog
```

- Cover image upload in the admin panel uses Cloudinary.
- Inline image upload inserts `![](url)` markdown using the returned Cloudinary URL.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
