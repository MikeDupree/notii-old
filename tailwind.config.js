/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./renderer/**/*.{tsx,ts,jsx,js}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#6b7280",
          DEFAULT: "#1f2937",
          dark: "#111827",
        },
        // Define your color palette for dark mode here
        dark: {
          light: "#9ca3af",
          DEFAULT: "#4b5563",
          dark: "#1f2937",
        },
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["dark"],
      borderColor: ["dark"],
      textColor: ["dark"],
    },
  },
  plugins: [require("tailwind-scrollbar"), require("tailwindcss-dark-mode")()],
};
