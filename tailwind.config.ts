import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17201b",
        leaf: "#1f8a5b",
        moss: "#dff4e8",
        coral: "#e85d4f",
        line: "#dde5df",
        paper: "#fbfcfa"
      },
      boxShadow: {
        soft: "0 16px 45px rgba(23, 32, 27, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
