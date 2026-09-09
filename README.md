# RN Saree Handlooms and Dress

**Mana Samskruthi Mana Chenatha** · మన సంస్కృతి మన చేనేత  
Nellore · Cash on Delivery

Live catalogue, admin CMS, COD orders, and customers are stored in **Postgres**. `data/catalog.json` is seed/backup only.

## Run locally

1. Copy `.env.example` to `.env` and set `DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
2. Optional for local image uploads: Cloudinary keys (otherwise files go to `public/uploads/`).

```bash
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Open http://localhost:3000

## Admin

- There is no public Admin tab. On `/account` Login (or Signup), enter `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env` — that secret door opens `/admin`.
- Customer emails still open a normal account.
- Add/edit products, banners, categories, testimonials, and images save to Postgres immediately (the live storefront reads the same database).
- **Save live** re-syncs the full catalogue.
- Images: Cloudinary on Vercel; local `public/uploads` only as a fallback on your machine.

## Production database (Neon)

1. Open [console.neon.tech](https://console.neon.tech) → New project (region close to India, e.g. Singapore / `ap-southeast-1`)
2. Copy the connection string (pooled or direct with `?sslmode=require`)
3. Put it in local `.env` as `DATABASE_URL`
4. Run `npx prisma db push` then `npm run db:seed` **once** so existing products land in Postgres
5. Use the **same** `DATABASE_URL` on Vercel

Prisma Postgres alternative: [console.prisma.io](https://console.prisma.io) → New project with database, or `npx create-db@latest --region ap-southeast-1 --env .env` then **claim** the database so it is not deleted after 24 hours.

## Cloudinary (Vercel image uploads)

1. [cloudinary.com](https://cloudinary.com) → sign up → Dashboard
2. Copy Cloud name, API Key, API Secret
3. Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` locally and on Vercel

## GitHub + Vercel

Git is not required on disk for the app to run, but Vercel deploys from GitHub:

1. Create a GitHub repo (empty, no README)
2. From this folder:

```bash
git init
git add .
git commit -m "Live admin and Postgres catalogue"
git branch -M main
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```

Do **not** commit `.env`.

3. [vercel.com](https://vercel.com) → Add New → Project → Import the GitHub repo
4. Add every env var listed in `.env.example` (Production + Preview)
5. Deploy. `npm run build` runs `prisma db push` so the production schema is applied automatically.
6. Seed once if the production DB is empty: locally, with production `DATABASE_URL`, run `npm run db:seed`
7. Open `https://YOUR-PROJECT.vercel.app` — staff sign in at `/account` with admin email and password to reach `/admin`

## Contact (live on site)

- Phone / WhatsApp: +91 90144 47240  
- Email: rnsareehandlooms@gmail.com  
- Address: Ramalingapuram, Near Mamatha Nursing Home, Nellore 524003  

---

© RN Saree Handlooms and Dress
