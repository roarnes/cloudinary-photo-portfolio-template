# Cloudinary Photo Portfolio

A fast, minimal photo portfolio served straight from
[Cloudinary](https://cloudinary.com): tag your photos, point this at the tag,
deploy. No backend, no database, no build-time image processing.

It shows a collage of grayscale tiles that come to colour on hover, and a
lightbox that fits any photo to the screen.

**Live demo:** _coming soon_

## What makes it fast

On the gallery this was extracted from, on a 2× (retina) laptop:

| | A typical first version | This template |
| --- | --- | --- |
| Opening the page | 1,078 KB, all 80 photos at once | **310 KB**, only what's on screen |
| Tiles on retina screens | Blurry (1× images) | Sharp |
| Opening a photo on a phone | 402 KB (the full original) | **163 KB**, including the next and previous photos |

How:

- **Lazy tiles.** Tiles are real `<img>` elements with `loading="lazy"`, so
  the browser only fetches what's near the screen. (CSS background images
  can't be lazy-loaded and all download at once.)
- **The right size, measured.** Each tile measures its box and requests that
  exact crop from Cloudinary at the screen's density, rounded to 100px steps
  so a few URLs get reused and cached.
- **The right format.** `f_auto` serves AVIF or WebP when the browser
  supports them and they're smaller; `q_auto` picks the quality.
- **A lighter budget for previews.** Tiles use at most 1.5× density and
  `q_auto:eco`. The lightbox gets full quality at up to 2×.
- **Lightbox sized to fit.** It works out the photo's displayed width from
  its dimensions and the window, and requests only that. The next and
  previous photos preload, so browsing feels instant.
- **One request for the list,** with no custom headers, so the browser
  doesn't send a CORS preflight first.

## Accessible by default

- Tiles are buttons: reachable with Tab, opened with Enter.
- The lightbox: Esc closes it, ← → browse, focus moves into it and back to
  the tile you came from, and the page behind doesn't scroll.
- Light and dark themes follow the system setting; hover motion respects
  reduced-motion preferences.

## Quick start

```bash
git clone https://github.com/roarnes/cloudinary-photo-portfolio-template.git
cd cloudinary-photo-portfolio-template
npm install
cp .env.example .env   # then fill in your details
npm run dev
```

## Set up Cloudinary

1. **Tag your photos.** Give every photo you want to show the same tag,
   e.g. `portfolio`. They appear in upload order.
2. **Allow the resource list.** The gallery reads
   `https://res.cloudinary.com/<cloud>/image/list/<tag>.json`, which is
   off by default. In the Cloudinary console go to **Settings → Security →
   Restricted media types** and untick **Resource list**.
   This makes the list of public IDs for any tag publicly readable, so
   only use it for photos you're publishing anyway.
3. **Add captions (optional).** In each photo's contextual metadata, set:
   - `caption`: the main line under the photo
   - `detail`: a second line, e.g. camera or film stock

## Configure

Set these in `.env` (or your host's environment variables). The cloud name
has no default, so it never ends up in the repo; the others fall back to the
defaults in [`src/config.js`](src/config.js):

| Variable | What it is |
| --- | --- |
| `VITE_CLOUDINARY_CLOUD_NAME` | **Required.** Your cloud name, the part after `res.cloudinary.com/` |
| `VITE_CLOUDINARY_TAG` | The tag whose photos to show |
| `VITE_SITE_TITLE` | Page heading |
| `VITE_SITE_SUBTITLE` | Line under the heading |

Colours, spacing and fonts are CSS variables at the top of
[`src/styles.css`](src/styles.css). The collage pattern is a few lines at the
top of [`src/components/Collage.jsx`](src/components/Collage.jsx).

## Deploy

It builds to a static site, so any static host works:

```bash
npm run build   # outputs to dist/
```

On Netlify or Vercel, use the build command `npm run build` and publish
directory `dist`, and set the environment variables above.

## A note on Cloudinary usage

Every new image size counts as a transformation on your Cloudinary plan the
first time it's requested; after that it's served from cache. Rounding sizes
to 100px steps keeps the number of variants small.

## License

[MIT](LICENSE). Photos in the demo are © Arnes Putri and not covered by the
license.
