/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  theme: {
    extend: {},
    colors: {
      white: "#fafafa",
      theme: "#21242d",
      "theme-reversed": "#fafafa",
      "theme-strong": "#171920",
      "theme-weak": "#333846",
      "sky-blue": "#00b0ff",
    },
  },
  plugins: [],
}
