import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Krypto",
    short_name: "Krypto",
    description: "A fun math game",
    start_url: "/krypto",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        purpose: "maskable",
        sizes: "512x512",
        src: "/icon512_maskable.png",
        type: "image/png",
      }
    ],
  };
}
