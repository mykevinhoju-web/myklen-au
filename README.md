# myklen.com.au

Platform for Australians who want to **start and run a cleaning business** — training, packages, branding, supplies, and (later) manager & customer portals.

**Separate project from [kshop-au](../kshop-au).**

## Run locally

```bash
cd myklen-au
npm install
npm run dev
```

**Port 3001** by default so **kshop can use 3000** at the same time.

- Marketing site: http://localhost:3001  
- Packages: http://localhost:3001/packages  
- Admin: http://localhost:3001/admin/login (default `admin` / `changeme` via `.env.local`)  
- Manager landing: http://localhost:3001/manager  
- Example customer portal: http://localhost:3001/m/demo  

Both running together:

| Project | Command | URL |
|---------|---------|-----|
| kshop-au | `npm run dev` | http://localhost:3000 |
| myklen-au | `npm run dev` | http://localhost:3001 |

## Homepage hero video

The hero uses `public/hero/hero-scene.mp4` (and `hero-scene-mobile.mp4`). The code is wired up; **the site only shows the video if these files are in Git and deployed**.

If the live site shows a grey hero or a still image only, add and push the folder:

```bash
git add public/hero
git commit -m "Add hero media for production"
git push
```

See `public/hero/ASSETS.md` for the full file list (~18MB desktop MP4 is normal).

Header wordmark: `public/brand/myklen-wordmark.png` — **must be committed** or production shows no image (`404` on myklen.com.au).

## Production data on Vercel (appointments, clients, messages)

Local dev writes to `data/*.json`. On Vercel you need **Blob storage** or saves are lost.

1. Vercel project → **Storage** → **Create Database** → **Blob** → connect to this app  
2. **Redeploy** (adds `BLOB_READ_WRITE_TOKEN`)  
3. First request copies `data/*.json` from the repo into Blob if empty  

After that, admin schedule and customer notes persist on **myklen.com.au**.

**Package prices** on the marketing site always come from `data/packages.json` in the repo (commit + push + redeploy). They are not read from Blob.

## Stripe (package sales — Phase 1)

1. Copy `.env.local.example` → `.env.local`  
2. Set `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_SITE_URL`  
3. Buy flow: package detail → **Buy with Stripe**

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for roles (admin / manager / customer), tenant URLs, and phased roadmap.

## Phases

| Phase | Focus |
|-------|--------|
| **1** | Marketing, packages, Stripe, admin |
| **2** | Manager login, dashboard, slug & subdomain links |
| **3** | Customer login, booking, feedback, custom domains |

## Open in Cursor

Open the **`myklen-au`** folder as its own workspace (not kshop-au).
