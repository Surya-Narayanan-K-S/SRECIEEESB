# ⚡ IEEE SREC Web Platform & Subdomain Ecosystem

> Official web architecture and deployment documentation for the IEEE Student Branch at Sri Ramakrishna Engineering College (SREC), Coimbatore.

---

## 🧠 System Architecture Mind Map

```mermaid
mindmap
  root((IEEE SREC Web Ecosystem))
    GoDaddy cPanel Server
      Main Domain: srecieee.org
        Folder: /public_html/
        Build: srecieee-main-deploy.zip
        Routing: Apache .htaccess SPA Rewrite
      Subdomain: aectsd2027.srecieee.org
        Folder: /public_html/aectsd2027/
        Build: aectsd-subdomain-deploy.zip
        Routing: Apache .htaccess SPA Rewrite
    GitHub Repositories
      Repo 1: Main Site Portal
        Local Directory: IEEESREC-main
        Tech: React 18 + Vite 7 + Tailwind
        CI/CD: .github/workflows/deploy.yml
        Target: /public_html/
      Repo 2: AECTSD 2027 Conference
        Local Directory: aectsd-main
        Tech: React 18 + Vite 8 + Tailwind
        CI/CD: .github/workflows/deploy.yml
        Target: /public_html/aectsd2027/
    Backend & Services
      Database: Supabase PostgreSQL
      Authentication: Supabase Auth
      Storage: Supabase Storage & Assets
      Analytics: Vercel Speed Insights & Analytics
```

---

## 🗺️ Dual Repository & Host Mapping

```mermaid
graph TD
    subgraph GitHub ["GitHub Repositories (CI/CD)"]
        R1["Repo 1: srecieeesb (IEEESREC-main)<br/>Main Website Portal"] -->|Push to main| W1[".github/workflows/deploy.yml"]
        R2["Repo 2: ICAECTSD (aectsd-main)<br/>AECTSD 2027 Subdomain Portal"] -->|Push to main| W2[".github/workflows/deploy.yml"]
    end

    subgraph GoDaddy ["GoDaddy Web Hosting (cPanel)"]
        W1 -->|FTP Deploy| Root["public_html/<br/>(srecieee.org)"]
        W2 -->|FTP Deploy| SubFolder["public_html/aectsd2027/<br/>(aectsd2027.srecieee.org)"]
    end

    subgraph Endpoints ["Live Public Websites"]
        Root --> Site1["🌐 https://srecieee.org"]
        SubFolder --> Site2["🌐 https://aectsd2027.srecieee.org"]
    end
```

---

## 📊 Dual Repository Summary Matrix

| Feature / Detail | Repository 1: Main Website | Repository 2: Conference Subdomain |
| :--- | :--- | :--- |
| **Public URL** | [`https://srecieee.org`](https://srecieee.org) | [`https://aectsd2027.srecieee.org`](https://aectsd2027.srecieee.org) |
| **Local Folder** | `IEEESREC-main` | `aectsd-main` |
| **GoDaddy Folder** | `public_html/` | `public_html/aectsd2027/` |
| **GitHub Action** | `.github/workflows/deploy.yml` | `.github/workflows/deploy.yml` |
| **ZIP Package** | `srecieee-main-deploy.zip` | `aectsd-subdomain-deploy.zip` |
| **Routing Setup** | `.htaccess` (SPA rewrite to `/index.html`) | `.htaccess` (SPA rewrite to `/index.html`) |

---

## 🌐 Main Website Page Index (`srecieee.org`)

The main repository contains 24+ pages compiled into a Single Page Application (SPA):

```mermaid
graph LR
    App["App Router (App.tsx)"] --> Core["Core Pages"]
    App --> Societies["Society Chapters"]
    App --> Admin["Admin CMS Portal"]

    Core --> P1["/ (Home)"]
    Core --> P2["/about (About)"]
    Core --> P3["/activities (Events)"]
    Core --> P4["/team (Office Bearers)"]
    Core --> P5["/past-bearers (Past Bearers)"]
    Core --> P6["/gallery (Gallery)"]
    Core --> P7["/awards (Awards)"]
    Core --> P8["/annual-plans (Plans)"]
    Core --> P9["/funding (Funding)"]
    Core --> P10["/join (Join Us)"]
    Core --> P11["/contact (Contact Us)"]

    Societies --> S0["/societies (Overview)"]
    Societies --> S1["/societies/srec (IEEE SREC)"]
    Societies --> S2["/societies/wie (WIE)"]
    Societies --> S3["/societies/embs (EMBS)"]
    Societies --> S4["/societies/cs (Computer Society)"]
    Societies --> S5["/societies/comsoc (ComSoc)"]
    Societies --> S6["/societies/pels (PELS)"]
    Societies --> S7["/societies/im (IMS)"]
    Societies --> S8["/societies/cis (CIS)"]

    Admin --> A1["/admin-login (Login)"]
    Admin --> A2["/admin/* (Dashboard & CMS)"]
```

---

## 🛠️ Local Development & Build Workflow

### Repository 1: Main Site (`IEEESREC-main`)
```bash
cd IEEESREC-main
npm install
npm run dev     # Starts local server on http://localhost:5173
npm run build   # Compiles production build into dist/
```

### Repository 2: Subdomain Site (`aectsd-main`)
```bash
cd aectsd-main
bun install     # or npm install
bun dev         # Starts local server on http://localhost:5173
bun run build   # Compiles production build into dist/
```

---

## ☁️ GoDaddy Deployment Instructions

### 📦 Option A: Quick Upload via cPanel File Manager

1. **Main Site (`srecieee.org`)**:
   - Build `IEEESREC-main` $\rightarrow$ Zip contents of `dist/` into `srecieee-main-deploy.zip`.
   - Open cPanel File Manager $\rightarrow$ Navigate to `public_html/`.
   - Upload `srecieee-main-deploy.zip` and click **Extract**.

2. **Subdomain Site (`aectsd2027.srecieee.org`)**:
   - Create subdomain `aectsd2027` in GoDaddy cPanel pointing to `public_html/aectsd2027`.
   - Build `aectsd-main` $\rightarrow$ Zip contents of `dist/` into `aectsd-subdomain-deploy.zip`.
   - Open cPanel File Manager $\rightarrow$ Navigate to `public_html/aectsd2027/`.
   - Upload `aectsd-subdomain-deploy.zip` and click **Extract**.

---

### 🔄 Option B: Automated Push-to-Deploy via GitHub Actions

Add the following **Secrets** in each GitHub repository (**Settings > Secrets and variables > Actions**):

* `FTP_SERVER`: GoDaddy FTP Server Host (e.g. `ftp.srecieee.org` or IP)
* `FTP_USERNAME`: GoDaddy cPanel FTP Username
* `FTP_PASSWORD`: GoDaddy cPanel FTP Password
* `VITE_SUPABASE_URL`: Supabase Project URL
* `VITE_SUPABASE_ANON_KEY`: Supabase Public Anon Key

Once added, pushing any commit to `main` branch will automatically build and deploy the changes via FTP!

---

## 📄 License & Copyright

© IEEE Student Branch SREC (STB64071). All rights reserved.
