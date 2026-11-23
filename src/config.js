// Everything you need to change to make the gallery yours.
// Each value can also be set with an environment variable (see .env.example).

export const config = {
  // Your Cloudinary cloud name: the part after res.cloudinary.com/ in any
  // of your image URLs.
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "",

  // Every image with this tag appears in the gallery, in upload order.
  tag: import.meta.env.VITE_CLOUDINARY_TAG || "shoots",

  // Page heading and the line under it.
  title: import.meta.env.VITE_SITE_TITLE || "Shoots",
  subtitle:
    import.meta.env.VITE_SITE_SUBTITLE ||
    "Film pictures I take when I'm not coding",
};
