# 🚀 Strapi Backend (nico-so-strapi)
Deploy to Strapi Cloud

Strapi v5 backend powering the nico-so portfolio. It exposes content APIs for bio, gallery-item, portfolio-item, and story.

## Repository links
- Frontend (Next.js 15): nicolasklein/nico-so
- Backend (this repo): nicolasklein/nico-so-strapi

## Prerequisites
- Node.js 20 or 22
- pnpm (recommended): `npm i -g pnpm`

## Quick start (local)

### Start Strapi
```bash
pnpm install
pnpm develop
```
Then open http://localhost:1337/admin to create the initial admin user.

### Configure access for the frontend
1. Create an API Token: Settings → API Tokens → New Token. Copy the value.
2. Public role: Settings → Roles → Public → enable "find" and "findOne" on bio, gallery-item, portfolio-item, story.

### Start the frontend
Follow the frontend quick start and set `.env.local` (values shown below). See: nico-so README

```
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_strapi_api_token
```

## Content types (alignment with frontend)
- **bio** (single type): tags (string), title (string), description (text), profileImage (media)
- **gallery-item** (collection): tag (string), image (media, multiple)
- **portfolio-item** (collection): Title (string), Description (string), FullImage (media)
- **story** (collection): title (string), description (text), images (media, multiple)

## API endpoints
Base URL: http://localhost:1337

- `GET /api/bio?populate=*` — fetch single bio
- `GET /api/gallery-items?populate=*` — list gallery items
- `GET /api/portfolio-items?populate=*` — list portfolio items
- `GET /api/stories?populate=*` — list stories (use sort=createdAt:desc if needed)

### Examples:
```bash
curl "http://localhost:1337/api/bio?populate=*" -H "Authorization: Bearer $STRAPI_API_TOKEN"
curl "http://localhost:1337/api/gallery-items?populate=*&pagination[pageSize]=100" -H "Authorization: Bearer $STRAPI_API_TOKEN"
```

## Seed data (optional)
An example seed script is provided. It uses the default SQLite database and loads assets from data/uploads.

```bash
pnpm run seed:example
```

## CORS
Default middleware includes strapi::cors. If the frontend runs on a different origin (e.g., http://localhost:3000 or a Vercel domain), ensure that origin is allowed.

## Scripts
- `pnpm develop`   # Start Strapi with autoReload
- `pnpm build`     # Build the admin panel
- `pnpm start`     # Start in production
- `pnpm deploy`    # Deploy (when configured)
- `pnpm seed:example`

## Deployment
Deploy to Strapi Cloud or any Node host. Configure the database and uploads (local/S3). Provide a production API Token for the frontend and set CORS to allow the frontend origin.

### Deploy to Strapi Cloud
1. Sign up or log in: [Strapi Cloud](https://cloud.strapi.io)
2. Connect GitHub and select this repository.
3. Choose plan, branch, and configure any environment variables.
4. Deploy the project.
5. After deploy: open the admin, create an API Token, configure Public role permissions, and note your cloud URL.
6. In the frontend, set:
   ```
   NEXT_PUBLIC_STRAPI_URL=https://YOUR-STRAPI-CLOUD-URL
   STRAPI_API_TOKEN=your_production_token
   ```

Docs: [Strapi Cloud Deployment Guide](https://docs.strapi.io/dev-docs/deployment/cloud)

## Learn more
- Strapi docs: https://docs.strapi.io