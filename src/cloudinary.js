// Cloudinary delivery URLs and the photo list.
// Transformation reference: https://cloudinary.com/documentation/transformation_reference

import { config } from "./config";

const base = `https://res.cloudinary.com/${config.cloudName}/image`;

// Sizes are rounded up to these steps so a handful of URLs get reused (and
// cached by the CDN and the browser) instead of a new one for every pixel
// of layout difference. Fewer variants also means fewer Cloudinary
// transformations counted against your plan.
const STEP = 100;
const roundUp = (value) => Math.ceil(value / STEP) * STEP;

// Screen density, capped: 2x density is 4x the pixels, and past a point
// the extra sharpness isn't visible on photos.
const pixelRatio = (max) => Math.min(window.devicePixelRatio || 1, max);

/**
 * A photo cropped to fill a box, for collage tiles. Width and height are
 * CSS pixels. Tiles are previews, so they get a lighter budget than the
 * lightbox: at most 1.5x density and Cloudinary's "eco" quality.
 */
export const tileUrl = (publicId, width, height) => {
  const dpr = pixelRatio(1.5);
  const w = roundUp(width * dpr);
  const h = roundUp(height * dpr);
  return `${base}/upload/c_fill,w_${w},h_${h},f_auto,q_auto:eco/${publicId}`;
};

/** The whole photo scaled to a display width, for the lightbox. */
export const fullUrl = (publicId, displayWidth) => {
  const w = roundUp(displayWidth * pixelRatio(2));
  return `${base}/upload/c_limit,w_${w},f_auto,q_auto/${publicId}`;
};

const toPhoto = (resource) => {
  const custom = resource.context?.custom ?? {};
  const metadata = (id) =>
    resource.metadata?.find((field) => field.external_id === id)?.value;

  return {
    id: resource.public_id,
    width: resource.width,
    height: resource.height,
    caption: custom.caption ?? custom.alt ?? "",
    // Second line under the caption, e.g. camera or film stock.
    detail: custom.detail ?? custom.film ?? metadata("film") ?? "",
  };
};

let request = null;

/**
 * Every image with the configured tag, with dimensions and captions.
 * Fetched once and shared. A plain GET with no custom headers, so the
 * browser doesn't send a CORS preflight first.
 *
 * Needs "Resource list" delivery to be allowed in Cloudinary:
 * Settings → Security → Restricted media types.
 */
export const fetchPhotos = () => {
  if (!request) {
    request = fetch(`${base}/list/${config.tag}.json`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(({ resources }) => resources.map(toPhoto))
      .catch((error) => {
        request = null;
        throw error;
      });
  }
  return request;
};
