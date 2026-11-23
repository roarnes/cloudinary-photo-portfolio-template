import { useCallback, useEffect, useRef, useState } from "react";
import { config } from "./config";
import { fetchPhotos } from "./cloudinary";
import { Collage } from "./components/Collage";
import { Lightbox } from "./components/Lightbox";

export const App = () => {
  const [photos, setPhotos] = useState([]);
  const [status, setStatus] = useState("loading");
  const [openIndex, setOpenIndex] = useState(null);
  const openerRef = useRef(null);

  useEffect(() => {
    if (!config.cloudName) {
      setStatus("unconfigured");
      return;
    }
    let isCurrent = true;
    fetchPhotos()
      .then((result) => {
        if (!isCurrent) return;
        setPhotos(result);
        setStatus("ready");
      })
      .catch(() => isCurrent && setStatus("error"));
    return () => {
      isCurrent = false;
    };
  }, []);

  const open = useCallback((index, opener) => {
    openerRef.current = opener;
    setOpenIndex(index);
  }, []);

  // Return focus to the tile that opened the lightbox.
  const close = useCallback(() => {
    setOpenIndex(null);
    openerRef.current?.focus();
  }, []);

  return (
    <main className="page">
      <header className="page-header">
        <h1>{config.title}</h1>
        <p>{config.subtitle}</p>
      </header>

      {status === "unconfigured" && (
        <p className="notice">
          Set VITE_CLOUDINARY_CLOUD_NAME to your Cloudinary cloud name.
        </p>
      )}
      {status === "error" && (
        <p className="notice">The photos couldn't load right now.</p>
      )}
      {status === "ready" && photos.length === 0 && (
        <p className="notice">No photos tagged “{config.tag}” yet.</p>
      )}
      {photos.length > 0 && <Collage photos={photos} onOpen={open} />}

      {openIndex !== null && (
        <Lightbox
          photos={photos}
          index={openIndex}
          onNavigate={setOpenIndex}
          onClose={close}
        />
      )}
    </main>
  );
};
