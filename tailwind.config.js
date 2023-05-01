/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./renderer/**/*.{tsx,ts,jsx,js}"],
  theme: {
    extend: {
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
