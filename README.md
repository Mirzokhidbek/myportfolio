# Mirzohid — Portfolio + Blog

Personal portfolio and blog built with Next.js. The home page shows experience, education, skills, projects and interests in English and Uzbek. The blog is written in Markdown and managed from an admin panel, and readers can sign up to like and comment on posts.

## Features

- **Portfolio**: experience, education, skills, languages, interests and projects, with an English / Uzbek switch
- **Blog**: Markdown posts with code highlighting, table of contents, reading time, reading progress bar, search, tag and category filters, and an RSS feed (`/blog/rss.xml`)
- **Admin panel** (`/admin`): create, edit and delete posts, set category, tags and cover image, upload images to Cloudinary
- **Accounts**: sign up and sign in with email and password (JWT in an httpOnly cookie)
- **Engagement**: views (counted once per day per browser), likes and comments on every post, plus share by link, Telegram or the native share sheet. Readers can delete their own comments, and admins can delete any comment
- **Light and dark theme**, saved per browser
- **SEO**: page metadata, Open Graph previews, canonical URLs, article structured data (JSON-LD), `sitemap.xml`, `robots.txt` and RSS

## Tech stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4, Framer Motion
- Prisma with SQLite
- `jose` (JWT), `bcryptjs`
- `react-markdown`, `remark-gfm`, `rehype-highlight`, `gray-matter`
- Cloudinary for image uploads

## Getting started

```bash
git clone https://github.com/Mirzokhidbek/myportfolio.git
cd myportfolio
npm install
cp .env.example .env
```

Fill in `.env` (both Next.js and the Prisma CLI read this file):

| Variable                   | Required    | Description                                                      |
| -------------------------- | ----------- | ---------------------------------------------------------------- |
| `DATABASE_URL`             | Yes         | SQLite path, relative to `prisma/`. Default `file:./data/app.db` |
| `AUTH_JWT_SECRET`          | Yes         | Secret for login tokens, at least 16 characters                  |
| `ADMIN_EMAIL`              | Yes         | The account with this email gets the admin role                  |
| `NEXT_PUBLIC_SITE_URL`     | Yes         | Public site URL, used in the sitemap, robots.txt and previews    |
| `CLOUDINARY_CLOUD_NAME`    | For uploads | Cloudinary cloud name                                            |
| `CLOUDINARY_API_KEY`       | For uploads | Cloudinary API key                                               |
| `CLOUDINARY_API_SECRET`    | For uploads | Cloudinary API secret                                            |
| `CLOUDINARY_UPLOAD_FOLDER` | No          | Base upload folder. Default `blog`                               |

Create the database tables and start the dev server:

```bash
npx prisma migrate deploy
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Admin access

1. Set `ADMIN_EMAIL` in `.env`.
2. Sign up at `/auth/signup` with that email. If the account already exists, signing in again promotes it to admin.
3. Open `/admin`.

Only admins can open `/admin` and use the admin API. Other signed-in users are sent back to the blog.

## Writing posts

Posts are Markdown files in `content/blog/`. You can write them in the admin panel, or create one from the command line:

```bash
npm run post:new -- "My post title"
```

Each file starts with front matter:

```md
---
title: "My Post Title"
author: "Mirzohid"
date: "2026-04-10"
category: "general"
tags: ["daily", "notes"]
coverImage: ""
excerpt: "Short summary shown on the blog list."
---

Write your content in Markdown below.
```

The file name (without `.md`) is the post slug, for example `/blog/2026-04-10-my-post-title`. Files starting with `_` (like `_template.md`) are ignored.

## Image uploads

The admin panel uploads cover and inline images to Cloudinary. Only image files up to 5 MB are accepted, and uploads stay inside `CLOUDINARY_UPLOAD_FOLDER` (for example `blog/covers` and `blog/inline`).

## API

| Method             | Path                          | Auth               | Description                                                   |
| ------------------ | ----------------------------- | ------------------ | ------------------------------------------------------------- |
| POST               | `/api/auth/signup`            | No                 | Create an account                                             |
| POST               | `/api/auth/signin`            | No                 | Sign in                                                       |
| POST               | `/api/auth/logout`            | No                 | Sign out                                                      |
| GET                | `/api/auth/me`                | No                 | Current user, or `null`                                       |
| GET                | `/api/posts`                  | No                 | All posts                                                     |
| GET                | `/api/posts/:slug`            | No                 | One post                                                      |
| GET, POST, DELETE  | `/api/posts/:slug/comments`   | POST/DELETE need sign in | List, add (max 1000 characters) or delete (`?id=`) comments |
| GET, POST          | `/api/posts/:slug/engagement` | Like needs sign in | Stats, or send `{ "action": "view" }` / `{ "action": "like" }` |
| GET, POST          | `/api/admin/posts`            | Admin              | List or create posts                                          |
| GET, PATCH, DELETE | `/api/admin/posts/:slug`      | Admin              | Read, update or delete a post                                 |
| POST               | `/api/admin/uploads/image`    | Admin              | Upload an image                                               |
| GET                | `/api/admin/users`            | Admin              | List users                                                    |

## Scripts

| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Start the dev server                 |
| `npm run build`    | Generate the Prisma client and build |
| `npm start`        | Start the production server          |
| `npm run lint`     | Run ESLint                           |
| `npm run post:new` | Create a new Markdown post           |

## Project structure

```
app/
├── page.tsx              # Portfolio home page
├── blog/                 # Blog list and post pages
├── admin/                # Admin panel
├── auth/                 # Sign in and sign up pages
├── api/                  # Route handlers
├── components/           # Theme toggle, site controls, blog components
├── sitemap.ts, robots.ts # SEO files
├── blog/rss.xml/         # RSS feed
└── not-found.tsx         # 404 page
content/blog/             # Markdown posts
lib/                      # Blog files, auth, Prisma, engagement helpers
prisma/                   # Schema and migrations
proxy.ts                  # Protects /admin routes
scripts/new-post.mjs      # Post generator
```

## Deploying

Set every variable from `.env.example` in your host's environment settings, and never commit `.env`.

Posts are saved as files and data is stored in SQLite, so the app needs a host with a persistent, writable disk. Serverless hosts such as Vercel do not keep file changes, so there the admin panel can't save posts and likes and comments won't persist.
