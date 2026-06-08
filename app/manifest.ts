import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "모일날",
    short_name: "모일날",
    description: "친구들과 가능한 날짜를 모아 최적의 모임 날짜를 찾는 웹앱",
    start_url: "/",
    display: "standalone",
    background_color: "#2DB400",
    theme_color: "#2DB400",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ]
  };
}
