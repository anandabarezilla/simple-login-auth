/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#DCFFB7",
        secondary: "#F8FAE5",
      },
    },
  },
  plugins: [],
};
