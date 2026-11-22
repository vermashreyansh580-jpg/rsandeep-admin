# R Sandeep Photography — Official Admin CMS

Dedicated, standalone Content Management System (CMS) for **R Sandeep Photography & Cinema** (Gorakhpur & Maharajganj).

---

## 🚀 Key Features

1. **Category Management:**
   - Create new event categories (e.g. Weddings, Haldi, Maternity, Pre-Wedding, Corporate).
   - Delete categories with one click.
   - Change/Update the front cover image of any category anytime (via file upload or URL).
   - Customize tags, badges, and descriptions.

2. **Photo Repository & Gallery:**
   - Filter photos by category.
   - Upload multiple photos simultaneously from computer/mobile (JPG, PNG, WEBP).
   - Delete individual photos.
   - **"Make Cover" Feature:** One-click setting to make any photo the front cover of its category.
   - Fullscreen photo zoom preview.

3. **Data Synchronization & Backups:**
   - **Live Sync:** Automatically synchronizes categories and photos to the client website (`rsandeep`) via shared local storage.
   - **JSON Export:** Download full `catalog.json` offline backup.
   - **JSON Import:** Restore all categories and photos from a saved backup file.
   - **Reset to Defaults:** Restore original studio starter collection.

4. **Authentication & Security:**
   - Studio Master PIN protection (`sandeep2026`).
   - Encrypted session with one-click logout.

---

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **UI:** React 18, Tailwind CSS, Lucide Icons
- **Typography:** Cinzel & Cormorant Garamond

---

## 💻 Running Locally

```bash
npm install
npm run dev
```

Admin dashboard opens at `http://localhost:3001` (or port 3000 if main website is stopped).
Main client website runs at `http://localhost:3000`.
