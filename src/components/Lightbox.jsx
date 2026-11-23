import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { fullUrl } from "../cloudinary";

// Space kept free around the photo (CSS px): the caption bar below it plus
// a margin. Keep in sync with --bar-height and --lightbox-gap in styles.css.
const reservedHeight = () => (window.innerWidth >= 600 ? 64 + 48 : 72 + 24);
const MAX_WIDTH = 0.94; // share of the window width

/** Width (CSS px) the photo will be shown at, fitting inside the window. */
const displayWidth = (photo) =>
  Math.min(
    window.innerWidth * MAX_WIDTH,
    (window.innerHeight - reservedHeight()) * (photo.width / photo.height),
    photo.width,
  );

const photoUrl = (photo) => fullUrl(photo.id, displayWidth(photo));

const preload = (photo) => {
  if (photo) new Image().src = photoUrl(photo);
};

export const Lightbox = ({ photos, index, onNavigate, onClose }) => {
  const closeRef = useRef(null);
  const photo = photos[index];
  const count = photos.length;
  const step = (by) => onNavigate((index + by + count) % count);

  // Keyboard: Esc closes, arrows browse.
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onNavigate((index + 1) % count);
      if (event.key === "ArrowLeft") onNavigate((index - 1 + count) % count);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, count, onNavigate, onClose]);

  // Focus moves into the dialog, and the page behind doesn't scroll.
  useEffect(() => {
    closeRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  // Warm up the neighbours so browsing feels instant.
  useEffect(() => {
    preload(photos[(index + 1) % count]);
    preload(photos[(index - 1 + count) % count]);
  }, [photos, index, count]);

  return createPortal(
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={photo.caption || "Photo viewer"}
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <button
        ref={closeRef}
        type="button"
        className="lightbox-close"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>

      <figure className="lightbox-figure">
        <img
          key={photo.id}
          src={photoUrl(photo)}
          width={photo.width}
          height={photo.height}
          alt={photo.caption || "Untitled"}
        />
        <figcaption className="lightbox-bar">
          <button type="button" onClick={() => step(-1)} aria-label="Previous">
            ‹
          </button>
          <span className="lightbox-text">
            <span className="lightbox-caption">{photo.caption}</span>
            {photo.detail && (
              <span className="lightbox-detail">{photo.detail}</span>
            )}
          </span>
          <button type="button" onClick={() => step(1)} aria-label="Next">
            ›
          </button>
        </figcaption>
      </figure>
    </div>,
    document.body,
  );
};
