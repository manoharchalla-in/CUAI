import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        chat: {
          bg: "#212121",
          sidebar: "#171717",
          messageBg: "#2f2f2f",
          hover: "#2f2f2f",
          border: "#3f3f46",
          accent: "#10a37f"
        }
      },
    },
  },
  plugins: [],
};
export default config;
