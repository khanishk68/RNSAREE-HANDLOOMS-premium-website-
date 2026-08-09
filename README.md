# RN Saree Handlooms and Dress

**Mana Samskruthi Mana Chenatha** · మన సంస్కృతి మన చేనేత  
Nellore · Cash on Delivery

## Run locally

```bash
npm install
npx prisma db push
npm run dev
```

Open http://localhost:3000

## Admin

- `/admin/login`
- Email / password from `.env` (`NEXT_PUBLIC_ADMIN_EMAIL` / `NEXT_PUBLIC_ADMIN_PASSWORD`)
- Add products, banners, categories → click **Publish live** (saves to `data/catalog.json`)
- Upload images from your PC (saved in `public/uploads/`)

## Deploy (Vercel)

1. Push this repo to GitHub  
2. Import on [vercel.com](https://vercel.com)  
3. Set env vars from `.env.example`  
4. Deploy  

**Important for Vercel:** the filesystem is read-only after deploy.  
Workflow: add products & images **locally** → Publish live → commit `data/catalog.json` and `public/uploads/` → push → redeploy.  
Then every customer sees the same catalogue.

For live admin edits on Vercel later, connect Postgres + Cloudinary.

## Contact (live on site)

- Phone / WhatsApp: +91 90144 47240  
- Email: rnsareehandlooms@gmail.com  
- Address: Ramalingapuram, Near Mamatha Nursing Home, Nellore 524003  

---

© RN Saree Handlooms and Dress
