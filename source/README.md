# Portfolio source

The public website is served from the repository root. This directory holds the editable React source.

- `app/portfolio-data.json`: original biography, experience, education, skills, and project descriptions.
- `app/page.tsx`: page sections and interactions, including the five Creative mode notes.
- `app/research-notes.ts`: project notebook details.
- `app/globals.css`: layout, themes, responsive styles, and animations.
- `app/creative-inspector.tsx`: purple layout guides.
- `public/`: fonts and portraits.

## Build and export

```sh
npm ci
npm run build
node scripts/publish-static.mjs
```

Run these commands from `source/`. The export updates the root website files and formats the HTML, CSS, and JavaScript. Commit the generated root files along with source changes. GitHub Pages publishes `main` from the repository root.

The existing `resume_vk.pdf` stays at the repository root. The original portrait is preserved; the directional portrait sheets are AI-generated adaptations. Font licenses are included alongside the fonts.
