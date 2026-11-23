import { useEffect, useRef, useState } from "react";
import { tileUrl } from "../cloudinary";

// The collage repeats a block of 6 photos over 4 rows and 3 columns:
//   b a a
//   b a a
//   b c d
//   e f d
// Change the pattern here; every letter must form a rectangle.
const BLOCK_ROWS = ["b a a", "b a a", "b c d", "e f d"];
const BLOCK_AREAS = ["a", "b", "c", "d", "e", "f"];

const templateAreas = (count) => {
  const blocks = Math.ceil(count / BLOCK_AREAS.length);
  return Array.from({ length: blocks }, (_, block) =>
    BLOCK_ROWS.map((row) => `'${row.replace(/\w/g, `$&${block}`)}'`).join(" "),
  ).join(" ");
};

const gridArea = (index) => {
  const area = BLOCK_AREAS[index % BLOCK_AREAS.length];
  const block = Math.floor(index / BLOCK_AREAS.length);
  return `${area}${block}`;
};

// A tile measures its own box and asks Cloudinary for exactly that crop.
// Nothing downloads until the size is known, and the browser only fetches
// the image once the tile is near the viewport (loading="lazy").
const Tile = ({ photo, area, onOpen }) => {
  const ref = useRef(null);
  const [size, setSize] = useState(null);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width && height) setSize({ width, height });
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <button
      ref={ref}
      type="button"
      className="tile"
      style={{ gridArea: area }}
      onClick={onOpen}
      aria-label={`Open: ${photo.caption || "untitled"}`}
    >
      {size && (
        <img
          src={tileUrl(photo.id, size.width, size.height)}
          alt=""
          loading="lazy"
          decoding="async"
        />
      )}
    </button>
  );
};

export const Collage = ({ photos, onOpen }) => (
  <div
    className="collage"
    style={{ gridTemplateAreas: templateAreas(photos.length) }}
  >
    {photos.map((photo, index) => (
      <Tile
        key={photo.id}
        photo={photo}
        area={gridArea(index)}
        onOpen={(event) => onOpen(index, event.currentTarget)}
      />
    ))}
  </div>
);
