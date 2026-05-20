import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        thinking: { "0%,80%,100%": { transform: "scale(.5)", opacity: ".3" }, "40%": { transform: "scale(1)", opacity: "1" } },
        float: { "0%,100%": { transform: "translate(0,0)" }, "50%": { transform: "translate(20px,-20px)" } },
        blink: { "0%,100%": { opacity: "1" }, "50%": { opacity: "0" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
      animation: {
        thinking: "thinking 1.4s ease-in-out infinite",
        float: "float 8s ease-in-out infinite",
        blink: "blink .7s infinite",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
