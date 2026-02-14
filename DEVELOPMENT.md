# Development Guide

This project is Anastasiia Andriichuk's motion designer portfolio, built with **Eleventy (11ty)**, **Sass**, and **Decap CMS**. It is hosted on **Netlify**.

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| [Node.js](https://nodejs.org/) | 22 LTS | Runtime |
| [OrbStack](https://orbstack.dev/) (Mac) or [WSL 2](https://learn.microsoft.com/en-us/windows/wsl/install) (Windows) | Latest | Linux container environment |
| [Git](https://git-scm.com/) | Latest | Version control |

---

## 1 — Set Up the Dev Environment

### macOS (OrbStack)

```bash
# 1. Create the container
orb create ubuntu:questing nastia-works -a amd64

# 2. Install Node.js 22 LTS inside the container
orb run -m nastia-works -u root bash -c \
  "apt-get update && apt-get install -y curl && \
   curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
   apt-get install -y nodejs"

# 3. Install project dependencies (project dir is auto-mounted)
orb run -m nastia-works -w /path/to/nastia-works npm install
```

### Windows (WSL 2)

```powershell
# 1. Open PowerShell as Administrator and install WSL with Ubuntu
wsl --install -d Ubuntu

# 2. Launch Ubuntu, then inside the WSL shell:
```

```bash
# Update packages and install Node.js 22 LTS
sudo apt-get update && sudo apt-get install -y curl
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo bash -
sudo apt-get install -y nodejs

# Navigate to your project (Windows drives are mounted under /mnt/)
cd /mnt/c/Users/<YourUser>/path/to/nastia-works

# Install project dependencies
npm install
```

---

## 2 — Run the App Locally

### macOS (OrbStack)

```bash
# Start the dev server (Eleventy + Sass watch)
orb run -m nastia-works -w /path/to/nastia-works npm start
```

- **Portfolio** → `http://nastia-works.orb.local:8080`
- **Admin panel** (Decap CMS) → `http://nastia-works.orb.local:8080/admin/`

### Windows (WSL 2)

```bash
# Inside the WSL shell, from the project directory:
npm start
```

- **Portfolio** → `http://localhost:8080`
- **Admin panel** (Decap CMS) → `http://localhost:8080/admin/`

### Build Only (no dev server)

```bash
# macOS
orb run -m nastia-works -w /path/to/nastia-works npm run build

# Windows (WSL)
npm run build
```

The built site is output to the `_site/` directory.

### Stop the Container (macOS)

```bash
orb stop nastia-works
```

---

## 3 — Push Changes to Production

The site is deployed to **Netlify** automatically when changes are pushed to the `main` branch.

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

Netlify will pick up the push, run `eleventy && npm run build:css`, and deploy the `_site/` directory.

### Admin Panel (Decap CMS)

The admin panel uses **Decap CMS** with the **git-gateway** backend provided by Netlify. Content editors can log in at `/admin/` using **Netlify Identity**. To manage users:

1. Go to your site's **Netlify Dashboard** → **Integrations** → **Identity**
2. Invite or manage users there
3. Ensure **Git Gateway** is enabled under **Identity** → **Services**

---

## Project Structure

```
nastia-works/
├── .eleventy.js          # Eleventy configuration
├── package.json          # Dependencies and scripts
├── src/
│   ├── _data/            # Global data (site.json, categories.yml, contact.json)
│   ├── _includes/        # Layouts, partials, components (Nunjucks)
│   ├── _works/           # Portfolio entries (Markdown with front matter)
│   ├── admin/            # Decap CMS admin panel (config.yml + index.html)
│   ├── assets/           # CSS (Sass), fonts, images
│   ├── pages/            # Additional page templates
│   ├── index.njk         # Home page
│   ├── about.njk         # About page
│   └── illustration.njk  # Illustration category page
└── _site/                # Build output (git-ignored)
```

## npm Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Dev server with live reload + Sass watch |
| `npm run build` | Production build (Eleventy + Sass) |
| `npm run build:css` | Compile Sass only |
| `npm run watch:css` | Watch Sass for changes |
