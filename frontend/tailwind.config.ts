import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#171717",
        paper: "#fbfaf7",
        mint: "#63c6a2",
        coral: "#ff7d63",
        sky: "#6ba6ff",
      },
      boxShadow: {
        soft: "0 16px 40px rgba(23, 23, 23, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
