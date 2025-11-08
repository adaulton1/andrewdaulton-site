# Andrew Daulton — One page (Video Showcase)

This is a Vite + React + TypeScript + Tailwind project containing the VideoShowcase component.

Local dev
1. npm install
2. npm run dev
3. Open http://localhost:5173

Build
1. npm run build
2. npm run preview (serve the build locally)

Deploy to Vercel
1. Push this repo to GitHub (main).
2. In Vercel, choose "Import Project" and pick this GitHub repo.
3. Vercel will detect a Vite project. Ensure:
   - Build command: npm run build
   - Output directory: dist
4. Deploy. Vercel will build and serve the site automatically.

Notes
- Vimeo thumbnail fetching uses the public Vimeo v2 API from the browser. If you see missing thumbnails due to CORS or rate-limits, I can add a server-side fetch or hardcode thumbnails.
- Tailwind is used for styling. If you prefer plain CSS, I can convert the component styles.