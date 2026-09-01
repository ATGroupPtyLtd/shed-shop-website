# Shed Shop Website

The Shed Shop website, built with React, Vinext and Cloudflare Workers.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Cloudflare deployment

Cloudflare Workers Builds should use:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Production branch: `main`

Every push to `main` will build and deploy the website automatically.
