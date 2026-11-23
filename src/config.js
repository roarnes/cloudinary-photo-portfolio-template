// Everything you need to change to make the gallery yours.
// Each value can also be set with an environment variable (see .env.example).

export const config = {
  // Your Cloudinary cloud name: the part after res.cloudinary.com/ in any
  // of your image URLs. Required, and only read from the environment so it
  // stays out of the repo: set it in .env locally and in your host's settings.
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "",

  // Every image with this tag appears in the gallery, newest first.
  tag: import.meta.env.VITE_CLOUDINARY_TAG || "portfolio",

  // Page heading and the line under it.
  title: import.meta.env.VITE_SITE_TITLE || "Your page title",
  subtitle: import.meta.env.VITE_SITE_SUBTITLE || "A line about your photos",
};
