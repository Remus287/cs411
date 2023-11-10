/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        left : '-20px 0px 20px -10px rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'landing-main' : './public/background.jpg'
      }
    },
  },
  plugins: [],
}