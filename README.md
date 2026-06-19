# Genisys Support Hub

Standalone Support & Knowledge Hub for Genisys clients, built with Vite, React, Tailwind CSS and Payload CMS.

## What Is Included

- Support Hub landing page
- Knowledge article listing, category sections and dynamic article pages
- Downloads & Resources hub backed by Payload-managed PDF resources
- Payload admin area on `/admin`
- Payload collections for articles, categories, authors, resources, media and users
- Support-role access helpers for managing Support Hub content without exposing unrelated CMS areas
- Genisys brand assets and Support Hub styling tokens

## Local Setup

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Update `.env.local` with a strong `PAYLOAD_SECRET`.

Run the frontend and Payload CMS together:

```bash
npm run dev
```

The Vite frontend runs on `http://localhost:5173`.
Payload CMS runs on `http://localhost:3001/admin`.

## Useful Commands

```bash
npm run build
npm run build:cms
npm run typecheck
npm run payload:generate:importmap
npm run generate:static-support-data
npm run seed:support-hub
```

`generate:static-support-data` rebuilds the static article fallback used by the
Vite frontend when the live Payload API is not available.

## Environment Variables

```bash
PAYLOAD_SECRET=replace-with-a-long-random-secret
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3001
DATABASE_URI=file:./cms/payload.sqlite
```

Do not commit real `.env` files, local SQLite databases, uploaded files, build output or `node_modules`.

## Vercel Deployment

This project deploys the public Support Hub as a Vite static frontend.

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`
- Root directory: `./`

These settings are also captured in `vercel.json`. Payload CMS/admin/API should
be deployed separately if live CMS editing is required in production.

## Hostinger Deployment

Hostinger static hosting needs Apache rewrite fallback support for React routes
such as `/support-hub/articles` and `/support-hub/articles/example-slug`.

The required `.htaccess` file lives in `public/.htaccess` and is copied into
`dist/.htaccess` during `npm run build`. Make sure hidden files are included
when uploading the `dist` folder to Hostinger.

## GitHub Checklist

1. Run `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Run `npm run typecheck`.
4. Run `npm run build`.
5. Run `npm run build:cms`.
6. Confirm `git status --ignored --short` only shows expected ignored local files.
7. Create the initial commit and push to a private GitHub repository.
